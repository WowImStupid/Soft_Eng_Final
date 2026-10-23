import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '../login/actions'
import { addTodo, toggleTodo, deleteTodo } from './actions'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // RLS already restricts rows to auth.uid(); the filter is defense in depth.
  const { data: todos } = await supabase
    .from('todos')
    .select('id, title, is_complete, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main>
      <div className="card">
        <div className="header">
          <div>
            <h1 style={{ margin: 0 }}>My todos</h1>
            <span className="muted">{user.email}</span>
          </div>
          <form action={signOut}><button>Sign out</button></form>
        </div>

        <form action={addTodo} className="add">
          <input name="title" placeholder="What needs doing?" required maxLength={200} />
          <button className="primary">Add</button>
        </form>

        {todos?.length ? (
          <ul>
            {todos.map((t) => (
              <li key={t.id} className={t.is_complete ? 'done' : ''}>
                <form action={toggleTodo.bind(null, t.id, !t.is_complete)}>
                  <button aria-label="Toggle complete">{t.is_complete ? '☑' : '☐'}</button>
                </form>
                <span className="title">{t.title}</span>
                <form action={deleteTodo.bind(null, t.id)}>
                  <button aria-label="Delete">✕</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">No todos yet. Add your first one above.</p>
        )}
      </div>
    </main>
  )
}
