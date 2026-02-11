# MakeTeam 프론트엔드 아키텍처

## 기술 스택

| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안정성 |
| Vite | 7.x | 빌드 도구 |
| Zustand | 5.x | 전역 상태 관리 |
| Tailwind CSS | 4.x | 유틸리티 CSS |
| shadcn/ui | latest | UI 컴포넌트 |

## 디렉토리 구조

```
src/
├── assets/              # 정적 리소스 (이미지, 폰트 등)
│   ├── images/
│   └── fonts/
├── components/          # 컴포넌트
│   ├── ui/              # shadcn/ui 컴포넌트 (자동 생성)
│   ├── common/          # 재사용 공통 컴포넌트
│   └── layout/          # 레이아웃 컴포넌트 (Header, Footer, RootLayout)
├── constants/           # 상수 정의 (라우트, 설정값 등)
├── hooks/               # 커스텀 React 훅
├── lib/                 # 외부 라이브러리 유틸 (shadcn/ui utils 등)
├── pages/               # 페이지 단위 컴포넌트
├── services/            # 외부 서비스 통신
│   └── api/             # API 클라이언트 및 엔드포인트별 함수
├── stores/              # Zustand 스토어
├── types/               # TypeScript 타입 정의
├── utils/               # 유틸리티 함수
└── note/                # 프로젝트 문서
```

## 각 디렉토리 역할

### `components/ui/`
shadcn/ui CLI로 추가되는 컴포넌트가 저장되는 곳. `npx shadcn@latest add <컴포넌트명>`으로 추가하며, 직접 수정이 가능하다.

### `components/common/`
프로젝트 전체에서 재사용되는 공통 컴포넌트. shadcn/ui를 조합하여 만든 비즈니스 컴포넌트가 들어간다.

### `components/layout/`
페이지 레이아웃을 구성하는 컴포넌트. Header, Footer, Sidebar, RootLayout 등.

### `pages/`
라우트 단위의 페이지 컴포넌트. 각 페이지는 해당 페이지에 필요한 컴포넌트를 조합한다.

### `stores/`
Zustand 스토어 파일. 파일명은 `use[도메인]Store.ts` 패턴을 따른다.

### `services/api/`
API 클라이언트와 엔드포인트별 서비스 함수. `client.ts`에 공통 fetch 로직이 있다.

### `hooks/`
커스텀 React 훅. UI 로직 재사용을 위한 훅들을 정의한다.

### `types/`
프로젝트 전역에서 사용하는 TypeScript 타입/인터페이스 정의.

### `constants/`
매직 넘버, 라우트 경로, 설정값 등 변하지 않는 값들을 관리한다.

## 주요 설정

### Path Alias
`@/`로 `src/` 디렉토리를 참조할 수 있다.
```typescript
import { Button } from '@/components/ui/button'
```

### 환경변수
`.env` 파일에서 `VITE_` 접두사로 환경변수를 정의한다.
```
VITE_API_BASE_URL=/api
```

### 상태 관리 (Zustand)
```typescript
// stores/useExampleStore.ts
import { create } from 'zustand'

interface ExampleState {
  count: number
  increment: () => void
}

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}))
```

## 컨벤션

- 컴포넌트: PascalCase (`HomePage.tsx`, `Button.tsx`)
- 훅: camelCase + `use` 접두사 (`useToggle.ts`)
- 스토어: camelCase + `use` 접두사 + `Store` 접미사 (`useExampleStore.ts`)
- 상수: UPPER_SNAKE_CASE (`API_BASE_URL`)
- 타입: PascalCase (`ApiResponse`, `UserProfile`)
