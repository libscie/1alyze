import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import styles from "src/styles/Home.module.css"
import Spreadsheet from "react-spreadsheet"
import axios from "axios"
import { tsv2json } from "tsv-json"
import getSessionToken from "../auth/queries/getSessionToken"

function getBase64(file) {
  return new Promise((resolve) => {
    var reader = new FileReader()
    reader.onloadend = function () {
      resolve(reader.result?.toString())
    }
    reader.readAsDataURL(file)
  })
}

const UserInfo = ({ setState }) => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)
  const [sessionToken] = useQuery(getSessionToken, null)
  const [processing, setProcessing] = useState(false)

  return (
    <>
      {/* {currentUser ? (
        <>
          <button
            className={styles.button}
            onClick={async () => {
              await logoutMutation()
            }}
          >
            Logout
          </button>
          <div>
            User id: <code>{currentUser.id}</code>
            <br />
            User role: <code>{currentUser.role}</code>
          </div>
        </>
      ) : (
        <>
          <Link href={Routes.SignupPage()} className={styles.button}>
            <strong>Sign Up</strong>
          </Link>
          <Link href={Routes.LoginPage()} className={styles.loginButton}>
            <strong>Login</strong>
          </Link>
        </>
      )} */}

      <div className="max-w-2xl">
        {processing ? (
          <button
            type="button"
            className="animate-pulse rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            disabled
          >
            Processing...
          </button>
        ) : (
          <label
            htmlFor="file-upload"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <span>Process screenshot</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              // onInput={async (event) => {
              //   const base = await getBase64(event.target["files"][0])

              //   console.log(base)
              // }}
              onChange={async (file) => {
                if (file.target.files![0]!.size > 1048576 * 2) {
                  alert("File is too big!")
                  file.target.value = ""
                } else {
                  setProcessing(true)
                  const base = await getBase64(file.target.files![0])
                  const res = await axios.post(
                    "https://api.mathpix.com/v3/text",
                    {
                      src: base,
                      formats: ["data"],
                      data_options: {
                        include_tsv: true,
                      },
                      enable_tables_fallback: true,
                    },
                    {
                      headers: {
                        app_token: sessionToken.app_token,
                      },
                    }
                  )
                  const tmp = tsv2json(res.data.data[0]["value"])
                  const final = tmp.map((y) => {
                    return y.map((z) => {
                      return { value: z }
                    })
                  })
                  setState(final)
                  setProcessing(false)
                  console.log(res)
                }
              }}
              accept="image/png, image/jpeg"
            />
          </label>
        )}
      </div>
    </>
  )
}

const testObject = [
  [
    "Year",
    "CO_(2) concentration \n(ppm)",
    " Mean Annual \n Temperature (^(@)C)",
    " Mean Annual \n Precipitation (mm)",
  ],
  ["2012", "366", "10", "500"],
  ["2013", "378", "11", "800"],
  ["2014", "382", "12", "940"],
  ["2015", "390", "13", "260"],
  ["2016", "405", "14", "710"],
  ["2017", "410", "15", "1430"],
]

const Home: BlitzPage = () => {
  const [spreadsheetData, setSpreadsheetData] = useState(
    testObject.map((y) => {
      return y.map((z) => {
        return { value: z }
      })
    })
  )
  const [selected, setSelected] = useState([])
  const spreadsheetRef = useRef(null)
  const [columns, setColumns] = useState(spreadsheetData[0]!.length)
  // const columns = spreadsheetData[0]!.length
  useEffect(() => {
    if (columns) {
      const nextSpreadsheetData = spreadsheetData.map((row) => {
        const nextRow = [...row]
        nextRow.length = columns
        return nextRow
      })
      console.log(nextSpreadsheetData)
      setSpreadsheetData(nextSpreadsheetData)
    }
  }, [columns])

  return (
    <Layout title="Home">
      <Banner />
      <div className={styles.globe} />

      <div className={styles.container}>
        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <div className={styles.buttonContainer}>
                <Suspense fallback="Loading...">
                  <UserInfo setState={setSpreadsheetData} />
                </Suspense>
              </div>
              <div ref={spreadsheetRef} className={styles.spreadsheetContainer}>
                <Spreadsheet
                  data={spreadsheetData}
                  onChange={setSpreadsheetData as any}
                  onSelect={(value) => {
                    // if (value[0]) {
                    //   console.log(spreadsheetData[value[0].row])
                    // }
                    if (value.length > 0) {
                      let res = [] as any
                      value.map((val) => {
                        res.push(spreadsheetData[val.row]![val.column])
                      })
                      setSelected(res)
                    }
                  }}
                />
              </div>
              {JSON.stringify(selected)}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Home

const Banner = () => {
  return (
    <div className="flex items-center gap-x-6 bg-indigo-600 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <p className="text-sm leading-6 text-white">
        <a href="https://github.com/libscie/1alyze/discussions">
          <strong className="font-semibold">Project in active development.</strong> Join the
          discussion on GitHub&nbsp;
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  )
}
