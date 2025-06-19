// Проверка данных на отсутствие несохраненных данных
export const checkUnsavedChanges = async (callback) => {
    const btns = document.querySelector('.tBody').querySelectorAll('.arrayData-btn-save');
    let isChanges = false;

    btns.forEach((element) => {
        if (!element.disabled) isChanges = true;
    });

    if (isChanges) {
        alert('Сохраните данные');
    } else {
        await callback();
    }
}
