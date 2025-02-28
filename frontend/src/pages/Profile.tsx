import authGuard from "../domains/auth/authGuard";

function Profile() {
  return (
    <div>Profile</div>
  )
}

export default authGuard(Profile);