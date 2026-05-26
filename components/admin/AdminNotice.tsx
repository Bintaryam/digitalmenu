type AdminNoticeProps = {
  message?: string;
};

export default function AdminNotice({ message }: AdminNoticeProps) {
  if (!message) return null;

  return (
    <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-bold text-green-800">
      {message}
    </div>
  );
}
