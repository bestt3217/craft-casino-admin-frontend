import BonusDetailPage from '@/components/pages/bonus/BonusDetailPage'

interface BonusDetailPageProps {
  params: Promise<{
    id: string
  }>
}

const BonusDetailPageComponent = async ({ params }: BonusDetailPageProps) => {
  const { id } = await params
  return <BonusDetailPage bonusId={id} />
}

export default BonusDetailPageComponent
