import { useLogout } from "../../../hooks/auth/useLogOut";

function Books() {
  const { logout } = useLogout();

  return (
    <div className="h-100 w-100 bg-green-400">
      <h1>Books</h1>
      <button
        onClick={logout}
        className="mt-10 cursor-pointer rounded-3xl bg-pink-500 px-4 py-2"
      >
        Log out
      </button>
    </div>
  );
}

export default Books;