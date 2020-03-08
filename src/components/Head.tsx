export function Head() {
  return (
    <>
      <style jsx>{`
        .session button {
          width: 10em;
          margin: 0.2em;
        }
        .title {
        margin: 1em 0;
        padding: 0.5em;
        border-top: 1px solid;
        border-bottom: 1px dashed;
        font-size: 140%;
      }

      `}</style>
      <div className="session">
        <a href="github/login" target="_blank">
          <button>Login</button>
        </a>
        <a href="github/logout" target="_blank">
          <button>Logout</button>
        </a>
      </div>
      <div className="title">GraphQL アクセステスト</div>
    </>
  );
}
