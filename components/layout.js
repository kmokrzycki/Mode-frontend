import Head from 'next/head'
import Header from './header'


const date = new Date();

const Layout = (props) => (
  <>
    <Head>
      <title>With Cookies</title>
    </Head>

    <Header />

    <main>
      <div className="container">{props.children}</div>
    <footer>
        <hr />
        <p className="align-self-center">Kris - Copyright © {date.getFullYear()} </p>
    </footer>
    </main>

    <style jsx global>{`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        color: #333;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, Noto Sans, sans-serif, 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
      }
      .container {
        max-width: 80rem;
        margin: 0 auto;
        padding: 2rem 1.25rem;
      }
      footer {
        color: #fff;
        background-color: #333;
        text-align: center;
        min-height:5rem;
      }
    `}</style>
  </>
)

export default Layout
