import { MainLayout } from "@/components/layout/MainLayout"
import { ModelSelector } from "@/components/settings/ModelSelector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const Settings = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Settings</CardTitle>
              <CardDescription>
                Configure which AI model to use for resume optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModelSelector />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}

export default Settings