"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Download } from "lucide-react"

type PiFile = {
  name: string
  size: number
  mtime: string
  isDir: boolean
}

export function StorageSection() {
  const [files, setFiles] = useState<PiFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>("")

  const load = async () => {
    try {
      setLoading(true)
      setError("")
      const r = await fetch("/api/storage/files", { cache: "no-store" })
      if (!r.ok) {
        const errText = await r.text()
        setError(`API error ${r.status}: ${errText}`)
        setFiles([])
        return
      }
      const data = await r.json()
      setFiles(Array.isArray(data) ? data : [])
    } catch (err: any) {
      setError(`Fetch failed: ${err?.message || "unknown error"}`)
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const onUpload: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fd = new FormData()
    fd.append("file", file)

    try {
      setUploading(true)
      const response = await fetch("/api/storage/upload", { method: "POST", body: fd })

      if (!response.body) {
        alert("Upload failed: No response body")
        return
      }

      // Read SSE stream for progress (optional - server sends progress events)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() || ""

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.error) {
                alert(`Upload failed: ${data.error}`)
                return
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }

      // Reload file list after successful upload
      await load()
    } finally {
      setUploading(false)
      e.target.value = ""
    }
  }

  return (
    <section className="max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Storage</h1>
          <p className="text-muted-foreground">Files served from your Raspberry Pi over Tailscale</p>
        </div>
        <div className="flex items-center gap-3">
          <Input type="file" onChange={onUpload} disabled={uploading} className="max-w-xs" />
          <Button onClick={load} disabled={loading} variant="outline">
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="grid grid-cols-12 px-4 py-3 text-sm text-muted-foreground border-b border-border">
          <div className="col-span-7">Name</div>
          <div className="col-span-3">Modified</div>
          <div className="col-span-2 text-right">Size</div>
        </div>
        {error && (
          <div className="px-4 py-4 text-sm text-destructive bg-destructive/10 rounded-lg">
            Error: {error}
          </div>
        )}
        {files.length === 0 && !error && (
          <div className="px-4 py-8 text-sm text-muted-foreground">No files yet. Upload one to get started.</div>
        )}
        {files.map((f) => (
          <div key={f.name} className="grid grid-cols-12 px-4 py-3 items-center border-t border-border/50">
            <div className="col-span-7 flex items-center gap-2">
              <a
                href={`/api/storage/file?name=${encodeURIComponent(f.name)}`}
                className="text-primary hover:underline"
                title="Download"
              >
                {f.name}
              </a>
            </div>
            <div className="col-span-3 text-sm text-muted-foreground">
              {new Date(f.mtime).toLocaleString()}
            </div>
            <div className="col-span-2 flex items-center justify-end gap-3">
              <span className="text-sm tabular-nums">{f.isDir ? "-" : formatBytes(f.size)}</span>
              {!f.isDir && (
                <a
                  className="inline-flex items-center justify-center rounded-md border px-2 py-1 text-sm hover:bg-accent"
                  href={`/api/storage/file?name=${encodeURIComponent(f.name)}`}
                  title="Download"
                >
                  <Download className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`
}

export default StorageSection
