import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { updateDocument } from './actions';
import UpdateButton from './UpdateButton';

export default function CreateDocumentPage() {
  return (
    
      <Card className="w-full max-w-4xl p-6 rounded-lg shadow-xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-semibold text-gray-800">Dokumentum feltöltése</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdateButton updateAction={updateDocument} />
        </CardContent>
      </Card>

  )
}