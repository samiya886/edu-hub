export default function Sidebar() {
  const subjects = ["Math", "Physics", "Chemistry", "Computer Science"];

  return (
    <div className="w-60 bg-slate-800 p-4 min-h-screen">
      <h2 className="text-lg font-bold mb-4">Subjects</h2>

      <ul className="space-y-2">
        {subjects.map((sub, i) => (
          <li
            key={i}
            className="p-2 rounded-lg hover:bg-slate-700 cursor-pointer"
          >
            {sub}
          </li>
        ))}
      </ul>
    </div>
  );
}