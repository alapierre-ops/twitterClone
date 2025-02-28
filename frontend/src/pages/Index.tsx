import authGuard from "../domains/auth/authGuard";

function Index() {
  const token = localStorage.getItem("token");
  return (
    <>
      <div>Index</div>
      <p>{token}</p>
    </>
  )
}

export default authGuard(Index);