export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction }) {
  return (
    <div className="text-center py-12">
      {Icon && <Icon className="w-16 h-16 text-slate-300 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-slate-600 mb-2">{title}</h3>
      {description && <p className="text-slate-500 mb-4">{description}</p>}
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}