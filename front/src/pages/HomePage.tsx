import { useExampleStore } from '@/stores/useExampleStore'
import { Button } from '@/components/ui/button'

export function HomePage() {
  const { count, increment, decrement, reset } = useExampleStore()

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-20">
      <h2 className="text-3xl font-bold">MakeTeam</h2>
      <p className="text-muted-foreground">프로젝트가 성공적으로 설정되었습니다.</p>

      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={decrement}>-</Button>
        <span className="text-2xl font-semibold w-12 text-center">{count}</span>
        <Button variant="outline" onClick={increment}>+</Button>
      </div>
      <Button variant="ghost" onClick={reset}>리셋</Button>
    </div>
  )
}
