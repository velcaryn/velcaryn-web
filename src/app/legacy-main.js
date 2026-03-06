document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Navigation Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.main-nav a');

    mobileMenuBtn.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
        });
    });

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            header.classList.remove('scrolled');
            header.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
        }
    });

    // --- Dynamic Catalog Loading ---
    const catalogGrid = document.getElementById('catalog-grid');
    const categoryFilter = document.getElementById('catalog-category');
    const searchInput = document.getElementById('catalog-search');

    let allProducts = [];

    // Fetch data
    fetch('data/catalog.json')
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            allProducts = data.products;
            populateCategories(data.categories);
            renderCatalog(allProducts);
            setupFilters();
        })
        .catch(error => {
            console.error('Error loading catalog:', error);
            catalogGrid.innerHTML = '<div class="error-msg">Failed to load catalog. Please try again later.</div>';
        });

    function populateCategories(categories) {
        // Clear existing, keep default
        categoryFilter.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = cat.name;
            categoryFilter.appendChild(option);
        });
    }

    function renderCatalog(productsToRender) {
        catalogGrid.innerHTML = ''; // Clear loading or previous state

        if (productsToRender.length === 0) {
            catalogGrid.innerHTML = '<div class="no-results">No products found matching your criteria.</div>';
            return;
        }

        productsToRender.forEach(product => {
            // Resolve category name
            const categoryName = categoryFilter.querySelector(`option[value="${product.category}"]`)?.textContent || product.category;

            // Image or placeholder
            const imageHTML = product.image
                ? `<div class="product-img"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>`
                : `<div class="product-img product-img-placeholder">
                       <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                           <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                           <circle cx="8.5" cy="8.5" r="1.5"/>
                           <polyline points="21 15 16 10 5 21"/>
                       </svg>
                       <span>Image Coming Soon</span>
                   </div>`;

            const cardHTML = `
                <div class="product-card">
                    ${imageHTML}
                    <div class="product-content">
                        <span class="product-category">${categoryName}</span>
                        <h3>${product.name}</h3>
                        <p class="product-desc">${product.description}</p>
                    </div>
                </div>
            `;

            catalogGrid.insertAdjacentHTML('beforeend', cardHTML);
        });
    }

    function setupFilters() {
        const filterProducts = () => {
            const searchTerm = searchInput.value.toLowerCase();
            const selectedCategory = categoryFilter.value;

            const filtered = allProducts.filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm);

                const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

                return matchesSearch && matchesCategory;
            });

            renderCatalog(filtered);
        };

        searchInput.addEventListener('input', filterProducts);
        categoryFilter.addEventListener('change', filterProducts);
    }
});
