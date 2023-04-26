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

  return (
    <>
      {currentUser ? (
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
      )}

      <div className="max-w-xl">
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
                console.log(res)
              }
            }}
            accept="image/png, image/jpeg"
          />
        </label>
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
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-red-500 to-indigo-900 opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
        aria-hidden="true"
      >
        <div
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-red-500 to-indigo-900 opacity-30"
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-gray-900">
          <strong className="font-semibold">⚠️1alyze⚠️</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          This page is in highly active development.
        </p>
        <a
          href="#"
          className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          Get in touch <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span className="sr-only">Dismiss</span>
        </button>
      </div>
    </div>
  )
}
