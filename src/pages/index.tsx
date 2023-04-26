import { Suspense, useEffect, useRef, useState } from "react"
import Link from "next/link"
import Layout from "src/core/layouts/Layout"
import { useCurrentUser } from "src/users/hooks/useCurrentUser"
import logout from "src/auth/mutations/logout"
import { useMutation } from "@blitzjs/rpc"
import { Routes, BlitzPage } from "@blitzjs/next"
import styles from "src/styles/Home.module.css"
import Spreadsheet, { createEmptyMatrix } from "react-spreadsheet"
import next from "next/types"

const columns = [
  { key: "id", name: "ID" },
  { key: "title", name: "Title" },
]

const rows = [
  { id: 0, title: "Example" },
  { id: 1, title: "Demo" },
]

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

function getBase64(file) {
  var reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = function () {
    console.log(reader.result)
  }
  reader.onerror = function (error) {
    console.log("Error: ", error)
  }
}

const UserInfo = () => {
  const currentUser = useCurrentUser()
  const [logoutMutation] = useMutation(logout)

  if (currentUser) {
    return (
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
    )
  } else {
    return (
      <>
        <Link href={Routes.SignupPage()} className={styles.button}>
          <strong>Sign Up</strong>
        </Link>
        <Link href={Routes.LoginPage()} className={styles.loginButton}>
          <strong>Login</strong>
        </Link>
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
            onChange={(file) => {
              if (file.target.files![0]!.size > 1048576 * 2) {
                alert("File is too big!")
                file.target.value = ""
              } else {
                console.log(file.target.value)
                getBase64(file.target.files![0])
              }
            }}
            accept="image/png, image/jpeg"
          />
        </label>
      </>
    )
  }
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

const Home: BlitzPage = () => {
  // const [spreadsheetData, setSpreadsheetData] = useState(createEmptyMatrix(4, 5) as any)
  const [spreadsheetData, setSpreadsheetData] = useState(testObject)
  const [selected, setSelected] = useState([])
  const spreadsheetRef = useRef(null)
  const columns = 9
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
        <div className={styles.toastContainer}>
          <p>
            <strong>Congrats!</strong> Your app is ready, including user sign-up and log-in.
          </p>
        </div>

        <main className={styles.main}>
          <div className={styles.wrapper}>
            <div className={styles.header}>
              <div className={styles.logo}></div>

              <h1>Your database & authentication is ready. Try it by signing up.</h1>

              {/* Auth */}

              <div className={styles.buttonContainer}>
                <Suspense fallback="Loading...">
                  <UserInfo />
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

            <div className={styles.body}>
              {/* Instructions */}
              <div className={styles.instructions}>
                <p>
                  <strong>Add a new model by running the following in your terminal:</strong>
                </p>

                <div>
                  <div className={styles.code}>
                    <span>1</span>
                    <pre>
                      <code>blitz generate all project</code>
                    </pre>
                  </div>

                  <div className={styles.code}>
                    <span>2</span>
                    <pre>
                      <code>Ctrl + c</code>
                    </pre>
                  </div>

                  <div className={styles.code}>
                    <span>3</span>
                    <pre>
                      <code>blitz dev</code>
                    </pre>
                  </div>

                  <div className={styles.code}>
                    <span>4</span>
                    <pre>
                      <code>
                        Go to{" "}
                        <Link href="/projects" className={styles.textLink}>
                          /projects
                        </Link>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
              {/* Links */}
              <div className={styles.linkGrid}>
                <a
                  href="https://blitzjs.com/docs/getting-started?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  Blitz Docs
                  <span className={styles.arrowIcon} />
                </a>
                <a
                  href="https://nextjs.org/docs/getting-started"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  Next.js Docs
                  <span className={styles.arrowIcon} />
                </a>
                <a
                  href="https://github.com/blitz-js/blitz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  Github Repo
                  <span className={styles.arrowIcon} />
                </a>
                <a
                  href="https://twitter.com/blitz_js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  Blitz Twitter
                  <span className={styles.arrowIcon} />
                </a>
                <a
                  href="https://discord.blitzjs.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.card}
                >
                  Discord Community
                  <span className={styles.arrowIcon} />
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className={styles.footer}>
          <span>Powered by</span>
          <a
            href="https://blitzjs.com?utm_source=blitz-new&utm_medium=app-template&utm_campaign=blitz-new"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.textLink}
          >
            Blitz.js
          </a>
        </footer>
      </div>
    </Layout>
  )
}

export default Home
