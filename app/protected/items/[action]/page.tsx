import { notFound } from 'next/navigation'
import { AddItemForm } from '@/components/wishlist/add-item-form'

interface AddEditItemPageProps {
  params: {
    action: string
  }
  searchParams: {
    id?: string
  }
}

export default function AddEditItemPage({
  params,
  searchParams,
}: AddEditItemPageProps) {
  const isEdit = params.action === 'edit'
  const itemId = searchParams.id

  if (isEdit && !itemId) {
    notFound()
  }

  return (
    <div className="container max-w-2xl py-10">
      <h1 className="mb-8 text-4xl font-bold">
        {isEdit ? 'Edit Item' : 'Add New Item'}
      </h1>

      <AddItemForm
        onSubmit={async (data) => {
          // This will be implemented when we set up Supabase
          console.log('Form data:', data)
        }}
      />
    </div>
  )
}
