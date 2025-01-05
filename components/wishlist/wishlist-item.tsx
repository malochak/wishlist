import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Link as LinkIcon } from 'lucide-react'

interface WishlistItemProps {
  id: string
  name: string
  description?: string
  imageUrl?: string
  purchaseLink?: string
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

export function WishlistItem({
  id,
  name,
  description,
  imageUrl,
  purchaseLink,
  onEdit,
  onDelete,
}: WishlistItemProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {imageUrl && (
        <div className="relative h-48 w-full">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader className="space-y-1">
        <h3 className="text-2xl font-semibold tracking-tight">{name}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {purchaseLink && (
          <a
            href={purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:underline"
          >
            <LinkIcon className="mr-1 h-4 w-4" />
            View product
          </a>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(id)}
          className="h-8"
        >
          <Edit className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(id)}
          className="h-8"
        >
          <Trash2 className="mr-1 h-4 w-4" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  )
}
