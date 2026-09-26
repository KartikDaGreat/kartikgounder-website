"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Trash2,
  Plus,
  Key,
  Copy,
  Check,
  Shield,
  ShieldOff,
  RefreshCw,
} from "lucide-react"

interface AskosUser {
  name: string
  createdAt: string
  active: boolean
}

interface AskosEntry {
  id: string
  author: string
  category: string
  content: string
  tags: string[]
  supersedes?: string
  supersededBy?: string
  createdAt: string
}

const CATEGORIES = [
  "decision",
  "architecture",
  "convention",
  "blocker",
  "status",
  "context",
  "todo",
] as const

const CATEGORY_COLORS: Record<string, string> = {
  decision: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  architecture: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  convention: "bg-green-500/20 text-green-300 border-green-500/30",
  blocker: "bg-red-500/20 text-red-300 border-red-500/30",
  status: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  context: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  todo: "bg-orange-500/20 text-orange-300 border-orange-500/30",
}

export default function AskosAdmin() {
  const [adminKey, setAdminKey] = useState("")
  const [authenticated, setAuthenticated] = useState(false)
  const [keyInput, setKeyInput] = useState("")

  const [users, setUsers] = useState<AskosUser[]>([])
  const [entries, setEntries] = useState<AskosEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [newUserName, setNewUserName] = useState("")
  const [tokenUser, setTokenUser] = useState("")
  const [tokenExpiry, setTokenExpiry] = useState("90d")
  const [generatedToken, setGeneratedToken] = useState("")
  const [copied, setCopied] = useState(false)

  const adminFetch = useCallback(
    async (action: string, extra: Record<string, string> = {}) => {
      const res = await fetch("/api/askos/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": adminKey,
        },
        body: JSON.stringify({ action, ...extra }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Request failed")
      }
      return res.json()
    },
    [adminKey]
  )

  const loadData = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [usersRes, entriesRes] = await Promise.all([
        adminFetch("list_users"),
        adminFetch("list_entries"),
      ])
      setUsers(usersRes.users)
      setEntries(entriesRes.entries.reverse())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [adminFetch])

  useEffect(() => {
    if (authenticated) loadData()
  }, [authenticated, loadData])

  const handleLogin = async () => {
    setAdminKey(keyInput)
    try {
      const res = await fetch("/api/askos/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Admin-Key": keyInput,
        },
        body: JSON.stringify({ action: "list_users" }),
      })
      if (res.ok) {
        setAuthenticated(true)
        try {
          sessionStorage.setItem("askos_key", keyInput)
        } catch {}
      } else {
        setError("Invalid admin key")
        setAdminKey("")
      }
    } catch {
      setError("Connection failed")
    }
  }

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("askos_key")
      if (saved) {
        setKeyInput(saved)
        setAdminKey(saved)
        fetch("/api/askos/admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Admin-Key": saved,
          },
          body: JSON.stringify({ action: "list_users" }),
        }).then((res) => {
          if (res.ok) setAuthenticated(true)
        })
      }
    } catch {}
  }, [])

  const handleAddUser = async () => {
    if (!newUserName.trim()) return
    try {
      await adminFetch("add_user", { name: newUserName.trim() })
      setNewUserName("")
      loadData()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleToggleUser = async (name: string, active: boolean) => {
    try {
      await adminFetch(active ? "deactivate_user" : "activate_user", { name })
      loadData()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleGenerateToken = async () => {
    if (!tokenUser) return
    try {
      const res = await adminFetch("generate_token", {
        name: tokenUser,
        expiresIn: tokenExpiry,
      })
      setGeneratedToken(res.token)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleDeleteEntry = async (id: string) => {
    try {
      await adminFetch("delete_entry", { id })
      loadData()
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <Card className="w-full max-w-sm bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-zinc-100 text-center">
              askos admin
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Admin key"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              className="bg-zinc-800 border-zinc-700 text-zinc-100"
            />
            <Button onClick={handleLogin} className="w-full">
              Authenticate
            </Button>
            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">askos</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={loadData}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        {error && (
          <p className="text-red-400 text-sm bg-red-950/50 p-3 rounded-lg border border-red-900">
            {error}
          </p>
        )}

        <Tabs defaultValue="entries">
          <TabsList className="bg-zinc-900 border-zinc-800">
            <TabsTrigger value="entries">
              Context Feed ({entries.length})
            </TabsTrigger>
            <TabsTrigger value="team">Team ({users.length})</TabsTrigger>
            <TabsTrigger value="tokens">Tokens</TabsTrigger>
          </TabsList>

          <TabsContent value="entries" className="space-y-3 mt-4">
            {entries.length === 0 && (
              <p className="text-zinc-500 text-center py-8">
                No entries yet. Generate tokens for your team and start building
                context.
              </p>
            )}
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="bg-zinc-900 border-zinc-800 group"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs px-2 py-0.5 rounded border ${
                            CATEGORY_COLORS[entry.category] ?? ""
                          }`}
                        >
                          {entry.category}
                        </span>
                        <span className="text-sm font-medium text-zinc-300">
                          {entry.author}
                        </span>
                        <span className="text-xs text-zinc-600">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-700 font-mono">
                          {entry.id}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300 whitespace-pre-wrap">
                        {entry.content}
                      </p>
                      {entry.tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap">
                          {entry.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-zinc-700 text-zinc-400"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {entry.supersedes && (
                        <p className="text-xs text-zinc-600">
                          supersedes {entry.supersedes}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 hover:bg-red-950/50 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="team" className="space-y-4 mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Teammate name"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddUser()}
                    className="bg-zinc-800 border-zinc-700 text-zinc-100"
                  />
                  <Button onClick={handleAddUser}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {users.map((user) => (
              <Card key={user.name} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-zinc-200">{user.name}</p>
                    <p className="text-xs text-zinc-500">
                      Added {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={user.active ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {user.active ? "active" : "inactive"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleToggleUser(user.name, user.active)
                      }
                    >
                      {user.active ? (
                        <ShieldOff className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <Shield className="h-4 w-4 text-green-400" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="tokens" className="space-y-4 mt-4">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Select value={tokenUser} onValueChange={setTokenUser}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue placeholder="Select user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users
                        .filter((u) => u.active)
                        .map((u) => (
                          <SelectItem key={u.name} value={u.name}>
                            {u.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Select value={tokenExpiry} onValueChange={setTokenExpiry}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30d">30 days</SelectItem>
                      <SelectItem value="90d">90 days</SelectItem>
                      <SelectItem value="365d">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleGenerateToken} disabled={!tokenUser}>
                    <Key className="h-4 w-4 mr-1" /> Generate
                  </Button>
                </div>

                {generatedToken && (
                  <div className="space-y-3">
                    <div className="relative">
                      <Textarea
                        readOnly
                        value={generatedToken}
                        className="bg-zinc-800 border-zinc-700 text-zinc-300 font-mono text-xs min-h-[80px]"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => handleCopy(generatedToken)}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <div className="bg-zinc-800 rounded-lg p-3 border border-zinc-700">
                      <p className="text-xs text-zinc-500 mb-2">
                        Example: add an entry
                      </p>
                      <pre className="text-xs text-zinc-400 overflow-x-auto whitespace-pre-wrap break-all">
{`curl -X PUT ${typeof window !== "undefined" ? window.location.origin : ""}/api/askos \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${generatedToken.slice(0, 20)}..." \\
  -d '{"category":"decision","content":"Your fact here","tags":["project"]}'`}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
