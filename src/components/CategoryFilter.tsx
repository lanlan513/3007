import { useFanStore } from '@/store/useFanStore';

export default function CategoryFilter() {
  const { categories, selectedCategory, setSelectedCategory } = useFanStore();

  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-6">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setSelectedCategory(cat.value)}
          className={`relative px-5 py-2 font-serif-sc text-base transition-all duration-300 ${
            selectedCategory === cat.value
              ? 'text-vermilion-500'
              : 'text-ink-500 hover:text-ink-800'
          }`}
        >
          {cat.label}
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-vermilion-500 transition-all duration-300 ${
              selectedCategory === cat.value ? 'w-full' : 'w-0'
            }`}
          />
          {selectedCategory === cat.value && (
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-vermilion-500 rotate-45" />
          )}
        </button>
      ))}
    </div>
  );
}
