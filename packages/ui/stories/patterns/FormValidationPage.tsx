import { OctagonX } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

import { DocPage, Section } from '../blocks/DocPage'
import { Field } from '../blocks/fixtures'
import { nav } from '../blocks/pages'
import { RuleList } from '../blocks/Steps'

function ProductForm() {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('4,5')
  const nameError = submitted && !name.trim() ? 'Add a product name.' : undefined
  const priceError =
    submitted && !/^\d+(\.\d{1,2})?$/.test(price) ? 'Use a dot for cents, e.g. 4.50' : undefined
  const errors = [nameError, priceError].filter(Boolean).length
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Add product</CardTitle>
        <CardDescription>Fernhill Market · Bakery</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {errors > 0 && (
          <Alert variant="destructive">
            <OctagonX aria-hidden />
            <AlertTitle>{errors === 1 ? '1 field needs a fix' : `${errors} fields need a fix`}</AlertTitle>
            <AlertDescription>Fix the fields below, then save again.</AlertDescription>
          </Alert>
        )}
        <Field
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          state={nameError ? 'error' : 'idle'}
          hint={nameError}
          className="w-full"
        />
        <Field
          label="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          state={priceError ? 'error' : 'idle'}
          hint={priceError ?? 'In dollars.'}
          inputMode="decimal"
          className="w-full"
        />
      </CardContent>
      <CardFooter>
        <Button onClick={() => setSubmitted(true)}>Save product</Button>
        <Button variant="outline" onClick={() => setSubmitted(false)}>
          Cancel
        </Button>
      </CardFooter>
    </Card>
  )
}

export function FormValidationPage() {
  return (
    <DocPage
      crumb={['Patterns', 'Form validation']}
      eyebrow="Patterns"
      title="Form validation"
      lead="Check on submit, then show each error under its field and a summary at the top. Press Save product to see it."
      file="stories/patterns/FormValidationPage.tsx"
      {...nav('Form validation')}
      toc={[
        { id: 'preview', label: 'Preview' },
        { id: 'rules', label: 'Rules' },
      ]}
    >
      <Section id="preview">
        <div className="rounded-lg border bg-muted p-6 max-[900px]:p-4">
          <ProductForm />
        </div>
      </Section>
      <Section id="rules" title="Rules">
        <RuleList
          items={[
            [
              'When',
              'On submit, and again on each change after the first submit. Never while the person is still typing the first time.',
            ],
            ['Where', 'Under the field, linked with aria-describedby, with an icon and a sentence.'],
            ['What it says', 'What is wrong and how to fix it: "Use a dot for cents, e.g. 4.50".'],
            ['Summary', 'A destructive Alert at the top with the count, when there is more than one field.'],
          ]}
        />
      </Section>
    </DocPage>
  )
}
