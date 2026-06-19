import React, { useContext, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../Context/ShopContext'
import Item from '../Components/Item/Item'
import './CSS/SearchResults.css'

const CATEGORY_LABEL = { men: 'Nam', women: 'Nữ', kid: 'Trẻ em' };

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const { all_product } = useContext(ShopContext);
    const [activeCategory, setActiveCategory] = useState('all');

    const results = useMemo(() => {
        const q = query.toLowerCase().trim();
        if (!q) return [];
        return all_product.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );
    }, [query, all_product]);

    const categories = useMemo(() => {
        const cats = [...new Set(results.map(p => p.category))];
        return cats;
    }, [results]);

    const displayed = activeCategory === 'all'
        ? results
        : results.filter(p => p.category === activeCategory);

    return (
        <div className="search-results-page">
            <div className="search-results-header">
                <h2>
                    Kết quả tìm kiếm cho: <span>"{query}"</span>
                </h2>
                <p className="search-results-count">
                    Tìm thấy <b>{results.length}</b> sản phẩm
                </p>
            </div>

            {results.length > 0 && categories.length > 1 && (
                <div className="search-filter-bar">
                    <button
                        className={`search-filter-btn${activeCategory === 'all' ? ' active' : ''}`}
                        onClick={() => setActiveCategory('all')}
                    >
                        Tất cả ({results.length})
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            className={`search-filter-btn${activeCategory === cat ? ' active' : ''}`}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {CATEGORY_LABEL[cat] || cat} ({results.filter(p => p.category === cat).length})
                        </button>
                    ))}
                </div>
            )}

            {displayed.length === 0 ? (
                <div className="search-empty">
                    <p>Không tìm thấy sản phẩm nào phù hợp với "<b>{query}</b>".</p>
                    <p>Thử tìm kiếm với từ khóa khác hoặc duyệt theo danh mục.</p>
                </div>
            ) : (
                <div className="search-results-grid">
                    {displayed.map(item => (
                        <Item
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default SearchResults
