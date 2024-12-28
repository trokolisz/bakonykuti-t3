import { updateLastModified } from './actions';
import UpdateButton from './UpdateButton';

export default function TestPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Update Page Content</h1>
      <UpdateButton updateAction={updateLastModified} />
    </div>
  );
}