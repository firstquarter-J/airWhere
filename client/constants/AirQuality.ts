// 대기질 등급별 라벨과 색상

export const AIR_QUALITY_GRADES = {
  1: { label: '좋음', color: '#3B82F6' },     // 파란색
  2: { label: '보통', color: '#10B981' },     // 초록색
  3: { label: '나쁨', color: '#F59E0B' },     // 주황색
  4: { label: '매우 나쁨', color: '#EF4444' }, // 빨간색
};

export const getGradeInfo = (grade: number | null) => {
  if (!grade) return { label: '정보 없음', color: '#6B7280' };
  return AIR_QUALITY_GRADES[grade as keyof typeof AIR_QUALITY_GRADES] || { label: '정보 없음', color: '#6B7280' };
};
