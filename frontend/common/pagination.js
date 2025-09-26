import * as components from "../components";

const createPageItem = (label, disabled, active, onClick) => {
    const li = components.getTagLi("page-item");

    if (disabled) li.classList.add("disabled");
    if (active) li.classList.add("active");

    const a = document.createElement("a");
    a.className = "page-link";
    a.href = "#";
    a.textContent = label;
    a.addEventListener("click", (e) => {
        e.preventDefault();
        if (!disabled && !active && onClick) onClick();
    });

    li.appendChild(a);
    return li;
}

export const renderPagination = ({ paginationContentId, searchParams, totalPages, onPageChange }) => {
    const paginationContent = document.getElementById(paginationContentId);

    paginationContent.innerHTML = ""

    const currentPage = searchParams.page;

    const nav = components.getTagNav();
    const ul = components.getTagUl("pagination");

    ul.appendChild(
        createPageItem("«", currentPage <= 1, false, async () => {
            searchParams.page = currentPage - 1;
            await onPageChange(searchParams);
        })
    );

    const pages = new Set();

    // первые 3
    for (let i = 1; i <= Math.min(3, totalPages); i++) {
        pages.add(i);
    }

    // текущая +-1
    for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        if (i >= 1 && i <= totalPages) pages.add(i);
    }

    // последние 3
    for (let i = totalPages - 2; i <= totalPages; i++) {
        if (i >= 1) pages.add(i);
    }

    const sortedPages = [...pages].sort((a, b) => a - b);

    let last = 0;
    for (const p of sortedPages) {
        if (p - last > 1) {
            ul.appendChild(createPageItem("…", true, false));
        }
        ul.appendChild(
            createPageItem(p, false, p === currentPage, async () => {
                searchParams.page = p;
                await onPageChange(searchParams);
            })
        );
        last = p;
    }

    ul.appendChild(
        createPageItem("»", currentPage >= totalPages, false, async () => {
            searchParams.page = currentPage + 1;
            await onPageChange(searchParams);
        })
    );

    nav.appendChild(ul);
    paginationContent.appendChild(nav)
}
