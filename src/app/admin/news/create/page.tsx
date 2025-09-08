import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

import ReactMarkdown from "react-markdown"

import { updateLastModified } from './actions';
import UpdateButton from './UpdateButton';

// Force dynamic rendering to avoid auth() bind errors
export const dynamic = 'force-dynamic';

export default function CreateNewsPage() {



  return (
    <div className="container py-8"> 
          <div className="text-center justify-center pb-6"><h1 className="text-5xl justify-center">Hír létrehozása</h1></div>
          <UpdateButton updateAction={updateLastModified}/>
    </div>
  )
}