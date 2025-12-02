#!/bin/bash

# 사용법 안내 함수
function show_usage {
  echo "❌ 에러: 커밋 메시지가 없습니다."
  echo "사용법:"
  echo "  1. 개발 저장 (dev):  ./deploy.sh \"커밋 메시지\""
  echo "  2. 상용 배포 (prod): ./deploy.sh \"커밋 메시지\" prod"
  exit 1
}

# 파라미터 받기
MSG="$1"
MODE="$2"

# 커밋 메시지가 없으면 종료
if [ -z "$MSG" ]; then
  show_usage
fi

echo "============================================="
echo "🌿 [1단계] dev 브랜치에 저장 중..."
echo "============================================="

# 1. dev 브랜치에 커밋 및 푸시 (항상 실행)
git add .
git commit -m "$MSG"
git push origin dev

# 2. 모드 확인 후 분기 처리
if [ "$MODE" == "prod" ]; then
  echo ""
  echo "============================================="
  echo "🚀 [2단계] main 브랜치 병합 및 배포 시작..."
  echo "============================================="
  
  git checkout main
  git pull origin main  # 원격 변경사항 동기화
  git merge dev         # dev 내용을 main에 합치기
  git push origin main  # AWS Amplify 배포 트리거
  
  git checkout dev      # 다시 작업하던 dev로 복귀
  
  echo ""
  echo "✅ [완료] 상용(Production) 배포가 시작되었습니다!"
  echo "AWS Amplify 콘솔을 확인하세요."
else
  echo ""
  echo "✅ [완료] dev 브랜치에 안전하게 저장되었습니다."
  echo "Tip: 배포하려면 뒤에 'prod'를 붙여주세요."
fi