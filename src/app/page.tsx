export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md mx-auto p-8">
        <h1 className="text-4xl font-bold text-blue-600 mb-6">
          时光机迎新系统
        </h1>
        <p className="text-gray-600 mb-8">
          河北师范大学软件学院
        </p>
        <p className="text-lg text-gray-800 mb-6">
          基于AI技术的创新迎新体验系统
        </p>
        <div className="space-y-4">
          <a 
            href="/test" 
            className="inline-block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            测试页面
          </a>
          <a 
            href="/api/health" 
            className="inline-block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            API状态检查
          </a>
        </div>
      </div>
    </div>
  )
}
