import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation, useQuery } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import styles from "src/styles/Home.module.css"
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet"
import next from "next/types"
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

// x.map((y) => {return y.map(z => { return {value: z}})})
// x being an array of arrays with values

const testObject = [
  [
    { value: "ID" },
    { value: "Task" },
    { value: "Client" },
    { value: "Area" },
    { value: "Country" },
    { value: "Contact" },
    { value: "Assignee" },
  ],
  [
    { value: "Total" },
    { value: "1000 records" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
    { value: "" },
  ],
  [
    { value: "0" },
    { value: "Task #1" },
    { value: "Braun Group" },
    { value: "Optimization" },
    { value: "Cayman Islands" },
    { value: "Felicita_Berge16@e..." },
    { value: "Jorge Muller" },
  ],
  [
    { value: "1" },
    { value: "Task #2" },
    { value: "Haag LLC" },
    { value: "Accounts" },
    { value: "Antigua and Barbuda" },
    { value: "Geo.Mills86@exam..." },
    { value: "Dr. Sandra Aberna.." },
  ],
  [
    { value: "2" },
    { value: "Task #3" },
    { value: "Streich Inc" },
    { value: "Solutions" },
    { value: "Turkmenistan" },
    { value: "Thomas24@exampl..." },
    { value: "Christy Parker" },
  ],
  [
    { value: "3" },
    { value: "Task #4" },
    { value: "Graham - Weissnat" },
    { value: "Brand" },
    { value: "Serbia" },
    { value: "Golden27@example..." },
    { value: "Gina Rosenbaum" },
  ],
  [
    { value: "4" },
    { value: "Task #5" },
    { value: "Harris - Stracke" },
    { value: "Group" },
    { value: "Jordan" },
    { value: "Rhoda_Ziemann8@..." },
    { value: "Luz Wilkinson" },
  ],
  [
    { value: "5" },
    { value: "Task #6" },
    { value: "Bosco and Sons" },
    { value: "Operations" },
    { value: "Denmark" },
    { value: "Johnpaul_Huels@e..." },
    { value: "Josh Mosciski" },
  ],
  [
    { value: "6" },
    { value: "Task #7" },
    { value: "Schiller, Wehner and Moore" },
    { value: "Interactions" },
    { value: "Costa Rica" },
    { value: "Louie68@example.org" },
    { value: "Carla Collins" },
  ],
  [
    { value: "7" },
    { value: "Task #8" },
    { value: "Denesik, Jerde and Hane" },
    { value: "Data" },
    { value: "Northern Mariana Islands" },
    { value: "Ervin_Dibbert@exa..." },
    { value: "Rachael Zemlak" },
  ],
  [
    { value: "8" },
    { value: "Task #9" },
    { value: "Cormier, Feeney and D'Amore" },
    { value: "Accounts" },
    { value: "Cuba" },
    { value: "Woodrow14@exam..." },
    { value: "Lynda Larkin" },
  ],
  [
    { value: "9" },
    { value: "Task #10" },
    { value: "Ebert, Schmeler and Stanton" },
    { value: "Web" },
    { value: "Liechtenstein" },
    { value: "Erica24@example.org" },
    { value: "Connie Kihn I" },
  ],
]

const test2 = [
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
    test2.map((y) => {
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
              <button
                onClick={() => {
                  setSpreadsheetData(testObject)
                }}
              >
                Switch to test
              </button>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default Home
