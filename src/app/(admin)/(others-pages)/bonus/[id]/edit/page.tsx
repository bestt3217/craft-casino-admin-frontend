import EditBonusPage from '@/components/pages/bonus/EditBonusPage'

interface EditBonusPageProps {
  params: Promise<{
    id: string
  }>
}

const EditBonusPageComponent = async ({ params }: EditBonusPageProps) => {
  const { id } = await params
  return <EditBonusPage bonusId={id} />
}

export default EditBonusPageComponent
