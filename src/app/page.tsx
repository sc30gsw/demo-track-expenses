import { AppLayout } from '~/components/ui/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/shadcn/card'
import { Badge } from '~/components/ui/shadcn/badge'
import { CalendarDays, TrendingUp, Target, AlertCircle } from 'lucide-react'

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">ダッシュボード</h1>
      </div>
      
      {/* 統計カード群 */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">今月の支出</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">¥85,420</div>
            <p className="text-muted-foreground text-xs">
              前月比 <span className="text-green-600">-5.2%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">予算残高</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">¥34,580</div>
            <p className="text-muted-foreground text-xs">
              予算使用率 <Badge variant="secondary">71%</Badge>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">節約効果</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">¥12,350</div>
            <p className="text-muted-foreground text-xs">
              目標比 <span className="text-green-600">+8.1%</span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">カテゴリ数</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">7</div>
            <p className="text-muted-foreground text-xs">
              アクティブなカテゴリ
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* 最近の活動 */}
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>最近の支出</CardTitle>
            <CardDescription>
              過去7日間の支出記録
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="font-medium text-sm leading-none">コンビニエンスストア</p>
                  <p className="text-muted-foreground text-sm">
                    食費 • 今日
                  </p>
                </div>
                <div className="ml-auto font-medium">¥680</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="font-medium text-sm leading-none">電車代</p>
                  <p className="text-muted-foreground text-sm">
                    交通費 • 昨日
                  </p>
                </div>
                <div className="ml-auto font-medium">¥240</div>
              </div>
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="font-medium text-sm leading-none">映画鑑賞</p>
                  <p className="text-muted-foreground text-sm">
                    娯楽費 • 2日前
                  </p>
                </div>
                <div className="ml-auto font-medium">¥1,800</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>今月の目標</CardTitle>
            <CardDescription>
              予算管理の進捗状況
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">食費</span>
                  <span className="text-sm">75%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-3/4 rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">娯楽費</span>
                  <span className="text-sm">60%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-3/5 rounded-full bg-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">交通費</span>
                  <span className="text-sm">45%</span>
                </div>
                <div className="h-2 rounded-full bg-muted">
                  <div className="h-2 w-2/5 rounded-full bg-primary" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
