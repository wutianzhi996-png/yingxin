export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">测试页面</h1>
        <p>如果你能看到这个页面，说明Vercel部署成功了！</p>
        <a 
          href="/" 
          className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          返回首页
        </a>
      </div>
    </div>
  )
}