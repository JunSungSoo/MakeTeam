# MakeTeam 프로젝트 계획서

## 1. 프로젝트 개요

### 서비스 목적
보드게임 모임에서 참가자들을 랜덤으로 팀을 나누어주는 웹 서비스.
회원이 가입하여 소속 그룹에 참여하면, 해당 그룹의 멤버들을 대상으로 팀당 인원수를 지정하여 랜덤 팀 배정을 수행하고 결과를 보여준다.

### 핵심 가치
- **간편함**: 복잡한 설정 없이 빠르게 팀을 나눌 수 있다
- **공정성**: 완전 랜덤 배정으로 공정한 팀 구성
- **그룹 관리**: 소속 그룹 단위로 멤버를 관리하여 반복적인 모임에 활용

---

## 2. 핵심 기능

### 2.1 회원 관리
| 기능 | 설명 |
|------|------|
| 회원가입 | 이메일 + 비밀번호로 가입, 이름 입력 |
| 로그인/로그아웃 | Firebase Auth 이메일/비밀번호 인증 |
| 프로필 관리 | 이름 수정 |

- OTP 인증 없음
- 소셜 로그인 없음 (이메일/비밀번호만)

### 2.2 그룹(소속) 관리
| 기능 | 설명 |
|------|------|
| 그룹 생성 | 로그인한 누구나 그룹을 생성할 수 있음 |
| 그룹 검색 | 그룹명으로 검색하여 가입 |
| 그룹 가입 | 검색 결과에서 가입 신청 |
| 그룹 멤버 조회 | 그룹에 속한 멤버 목록 확인 |
| 그룹 탈퇴 | 본인이 그룹에서 탈퇴 |

- 하나의 회원이 여러 그룹에 소속 가능
- 그룹 생성자가 해당 그룹의 관리자

### 2.3 팀 나누기
| 기능 | 설명 |
|------|------|
| 참가자 선택 | 그룹 멤버 중 팀 나누기에 참여할 인원 선택 |
| 팀당 인원수 지정 | 각 팀에 배정될 인원수를 지정 |
| 랜덤 배정 | 선택된 인원을 랜덤으로 팀에 배정 |
| 결과 표시 | 팀 배정 결과를 시각적으로 표시 |
| 결과 저장 | 팀 배정 결과를 Firestore에 저장 |
| 히스토리 조회 | 과거 팀 배정 결과 조회 |

---

## 3. 기술 스택

### 프론트엔드
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 19.x | UI 라이브러리 |
| TypeScript | 5.x | 타입 안정성 |
| Vite | 7.x | 빌드 도구 |
| Zustand | 5.x | 전역 상태 관리 |
| Tailwind CSS | 4.x | 유틸리티 CSS |
| shadcn/ui | latest | UI 컴포넌트 |
| React Router | 7.x | 클라이언트 라우팅 |
| Firebase SDK | 11.x | Firebase 연동 |

### 백엔드 (Firebase)
| 서비스 | 용도 |
|--------|------|
| Firebase Authentication | 회원 인증 (이메일/비밀번호) |
| Cloud Firestore | 데이터 저장 (NoSQL) |

- 별도 백엔드 서버 없이 Firebase 클라이언트 SDK로 직접 통신
- Firestore 보안 규칙으로 데이터 접근 제어

---

## 4. 데이터 모델 (Firestore)

### 4.1 users 컬렉션
```
users/{uid}
├── name: string              // 이름
├── email: string             // 이메일
├── createdAt: timestamp      // 가입일
└── updatedAt: timestamp      // 수정일
```

### 4.2 groups 컬렉션
```
groups/{groupId}
├── name: string              // 그룹명
├── description: string       // 그룹 설명 (선택)
├── ownerId: string           // 생성자 uid
├── memberIds: string[]       // 멤버 uid 배열
├── createdAt: timestamp      // 생성일
└── updatedAt: timestamp      // 수정일
```

### 4.3 teamResults 컬렉션
```
teamResults/{resultId}
├── groupId: string           // 소속 그룹 ID
├── createdBy: string         // 생성자 uid
├── membersPerTeam: number    // 팀당 인원수
├── teams: array              // 팀 배정 결과
│   └── [
│         {
│           teamNumber: number,
│           members: [{ uid: string, name: string }]
│         }
│       ]
├── totalMembers: number      // 총 참가 인원
├── totalTeams: number        // 총 팀 수
└── createdAt: timestamp      // 생성일
```

---

## 5. 프론트엔드 설계

### 5.1 페이지/라우트 구성
| 라우트 | 페이지 | 설명 | 접근 |
|--------|--------|------|------|
| `/` | HomePage | 랜딩 페이지 / 대시보드 | 공개 |
| `/login` | LoginPage | 로그인 | 비로그인 |
| `/register` | RegisterPage | 회원가입 | 비로그인 |
| `/groups` | GroupListPage | 내 그룹 목록 | 로그인 필수 |
| `/groups/search` | GroupSearchPage | 그룹 검색 및 가입 | 로그인 필수 |
| `/groups/create` | GroupCreatePage | 그룹 생성 | 로그인 필수 |
| `/groups/:id` | GroupDetailPage | 그룹 상세 (멤버 목록) | 로그인 필수 |
| `/groups/:id/team` | TeamMakePage | 팀 나누기 실행 | 로그인 필수 |
| `/groups/:id/history` | TeamHistoryPage | 팀 결과 히스토리 | 로그인 필수 |

### 5.2 Zustand 스토어 구성
| 스토어 | 역할 |
|--------|------|
| `useAuthStore` | 인증 상태 (user, loading, login, logout, register) |
| `useGroupStore` | 그룹 관련 상태 (groups, currentGroup, members) |
| `useTeamStore` | 팀 나누기 상태 (selectedMembers, membersPerTeam, result) |

### 5.3 컴포넌트 구조
```
components/
├── layout/
│   ├── RootLayout.tsx         # 전체 레이아웃
│   ├── Header.tsx             # 네비게이션 + 인증 상태
│   ├── Footer.tsx             # 푸터
│   └── AuthGuard.tsx          # 인증 가드 (로그인 필요 페이지 보호)
├── common/
│   ├── MemberList.tsx         # 멤버 목록 표시
│   ├── MemberSelector.tsx     # 팀 나누기용 멤버 선택 체크박스
│   └── TeamResultCard.tsx     # 팀 결과 카드
└── ui/                        # shadcn/ui 컴포넌트
    ├── button.tsx
    ├── input.tsx
    ├── card.tsx
    ├── checkbox.tsx
    ├── dialog.tsx
    └── ...
```

---

## 6. 팀 나누기 알고리즘

### 6.1 입력
- `members`: 참가자 배열 (선택된 멤버들)
- `membersPerTeam`: 팀당 인원수

### 6.2 로직
```
1. 참가자 배열을 랜덤으로 셔플 (Fisher-Yates 알고리즘)
2. 총 팀 수 계산: Math.ceil(총인원 / 팀당인원수)
3. 앞에서부터 팀당인원수만큼 잘라서 각 팀에 배정
4. 마지막 팀은 남은 인원 전부 배정 (팀당인원수보다 적을 수 있음)
```

### 6.3 예시

**예시 1**: 총 5명, 팀당 2명
```
셔플 결과: [A, B, C, D, E]
팀 수: Math.ceil(5 / 2) = 3
팀 1: [A, B]  (2명)
팀 2: [C, D]  (2명)
팀 3: [E]     (1명) ← 남는 인원
```

**예시 2**: 총 10명, 팀당 3명
```
셔플 결과: [A, B, C, D, E, F, G, H, I, J]
팀 수: Math.ceil(10 / 3) = 4
팀 1: [A, B, C]  (3명)
팀 2: [D, E, F]  (3명)
팀 3: [G, H, I]  (3명)
팀 4: [J]        (1명) ← 남는 인원
```

**예시 3**: 총 6명, 팀당 2명 (딱 나누어짐)
```
셔플 결과: [A, B, C, D, E, F]
팀 수: Math.ceil(6 / 2) = 3
팀 1: [A, B]  (2명)
팀 2: [C, D]  (2명)
팀 3: [E, F]  (2명)
```

### 6.4 구현 코드 (TypeScript)
```typescript
interface TeamMember {
  uid: string
  name: string
}

interface Team {
  teamNumber: number
  members: TeamMember[]
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function makeTeams(members: TeamMember[], membersPerTeam: number): Team[] {
  const shuffled = shuffleArray(members)
  const totalTeams = Math.ceil(shuffled.length / membersPerTeam)
  const teams: Team[] = []

  for (let i = 0; i < totalTeams; i++) {
    const start = i * membersPerTeam
    const end = i === totalTeams - 1
      ? shuffled.length        // 마지막 팀: 남은 인원 전부
      : start + membersPerTeam
    teams.push({
      teamNumber: i + 1,
      members: shuffled.slice(start, end),
    })
  }

  return teams
}
```

---

## 7. Firebase 보안 규칙 (Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // users: 본인만 읽기/수정 가능
    match /users/{uid} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == uid;
      allow update: if request.auth.uid == uid;
    }

    // groups: 로그인한 사용자만 접근
    match /groups/{groupId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null
        && request.auth.uid in resource.data.memberIds;
      allow delete: if request.auth != null
        && request.auth.uid == resource.data.ownerId;
    }

    // teamResults: 그룹 멤버만 접근
    match /teamResults/{resultId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
    }
  }
}
```

---

## 8. 개발 단계

### Phase 1: 프로젝트 기반 구축
- [ ] Firebase 프로젝트 생성 및 SDK 설치
- [ ] Firebase 초기화 설정 (`src/services/firebase.ts`)
- [ ] React Router 설치 및 라우트 구성
- [ ] 인증 가드 컴포넌트 (AuthGuard)
- [ ] 환경변수 설정 (`.env`에 Firebase 설정값)

### Phase 2: 회원 인증
- [ ] Firebase Auth 연동
- [ ] 회원가입 페이지 (RegisterPage)
- [ ] 로그인 페이지 (LoginPage)
- [ ] useAuthStore (Zustand) 구현
- [ ] Header에 로그인 상태 표시 및 로그아웃 버튼

### Phase 3: 그룹 관리
- [ ] Firestore 그룹 CRUD 서비스 함수
- [ ] 그룹 생성 페이지 (GroupCreatePage)
- [ ] 그룹 검색 및 가입 페이지 (GroupSearchPage)
- [ ] 내 그룹 목록 페이지 (GroupListPage)
- [ ] 그룹 상세 페이지 - 멤버 목록 (GroupDetailPage)
- [ ] useGroupStore 구현

### Phase 4: 팀 나누기 핵심 기능
- [ ] 팀 나누기 알고리즘 구현 (`src/utils/teamMaker.ts`)
- [ ] 팀 나누기 페이지 (TeamMakePage)
  - 멤버 선택 체크박스
  - 팀당 인원수 입력
  - 랜덤 배정 실행
  - 결과 표시 (팀별 카드)
- [ ] 결과 Firestore 저장
- [ ] 팀 결과 히스토리 페이지 (TeamHistoryPage)
- [ ] useTeamStore 구현

---

## 9. 프로젝트 디렉토리 구조 (최종)

```
MakeTeam/
├── note/                          # 프로젝트 문서
│   └── project-plan.md
├── front/                         # 프론트엔드
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/            # RootLayout, Header, Footer, AuthGuard
│   │   │   ├── common/            # MemberList, MemberSelector, TeamResultCard
│   │   │   └── ui/               # shadcn/ui 컴포넌트
│   │   ├── pages/                 # 각 라우트별 페이지 컴포넌트
│   │   ├── hooks/                 # 커스텀 훅
│   │   ├── stores/                # Zustand 스토어 (auth, group, team)
│   │   ├── services/
│   │   │   ├── firebase.ts        # Firebase 초기화
│   │   │   ├── auth.ts            # 인증 서비스 함수
│   │   │   ├── groups.ts          # 그룹 CRUD 서비스 함수
│   │   │   └── teamResults.ts     # 팀 결과 서비스 함수
│   │   ├── types/                 # TypeScript 타입 정의
│   │   ├── utils/
│   │   │   └── teamMaker.ts       # 팀 나누기 알고리즘
│   │   ├── constants/             # 상수 (라우트 등)
│   │   ├── lib/                   # shadcn/ui 유틸
│   │   └── assets/                # 정적 리소스
│   ├── .env                       # Firebase 설정 환경변수
│   └── ...
└── back/                          # (사용하지 않음 - Firebase 사용)
```
