// доступ к LocalStorage //
export class Storage {
    getItem(key) {
        let item = JSON.parse(localStorage.getItem(key));
        return item;
    }
    setItem(key, value) {
        value = JSON.stringify(value);
        localStorage.setItem(key, value);
    }
}
// включить/выключить возможность листать страницу //
export function toggleScroll() {
    let body = document.querySelector("body");
    let elems = [];
    // добавить классы блоков, к которым будет применен padding-right при блокировке скролла
    getPaddingElems(["page-block", "__padding-elem"]);

    if (body.classList.contains("__no-scroll")) {
        body.classList.remove("__no-scroll");
        elems.forEach((elem) => {
            elem.style.removeProperty("padding-right");
        });
    } else {
        body.classList.add("__no-scroll");
        elems.forEach((elem) => {
            elem.style.paddingRight = `${getScrollWidth()}px`;
        });
    }

    function getScrollWidth() {
        let block = document.createElement("div");
        block.style.width = "50px";
        block.style.height = "50px";
        block.style.overflow = "scroll";
        body.append(block);

        let scrollWidth = block.offsetWidth - block.clientWidth;
        block.remove();
        return scrollWidth;
    }
    function getPaddingElems(list) {
        list.forEach((i) => {
            document.querySelectorAll(`.${i}`).forEach((item) => {
                elems.push(item);
            });
        });
    }
}
// сделать первую букву заглавной //
export function capitalLetter(str) {
    if (!str) return;

    let letter = str.slice(0, 1).toUpperCase();
    str = str.slice(1, str.length);
    let newStr = `${letter}${str}`;

    return newStr;
}
// координаты элемента //
export function getCoords(elem) {
    let crd = elem.getBoundingClientRect();

    return {
        top: crd.top + window.pageYOffset,
        left: crd.left + window.pageXOffset,
    };
}
// spoiler //
export function initSpoilerElem(btn, body = btn.nextElementSibling) {
    setTimeout(() => {
        // btn - кнопка, открывающая/закрывающая спойлер, body - тело, открывающееся или закрывающееся
        const elem = btn.parentNode;
        const shownClass = "__spoiler-shown";
        body.style.removeProperty("max-height");
        const bodyHeight = body.offsetHeight;

        hide();
        btn.removeEventListener("click", toggle);
        btn.addEventListener("click", toggle);

        function toggle() {
            elem.classList.contains(shownClass) ? hide() : show();
        }
        function hide() {
            elem.classList.remove(shownClass);
            body.style.cssText = `
          max-height: 0px;
          padding: 0px;
      `;
        }
        function show() {
            elem.classList.add(shownClass);
            body.style.cssText = `max-height: ${bodyHeight * 1.5}px;`;
            body.style.removeProperty("padding");
        }
    }, 0);
}

// position: sticky //
export function positionSticky(el, transitionEl = null) {
    // transitionEl - элемент/массив элементов, изменяющи[й,х] высоту с transition
    const posClasses = {
        top: "__stick-top",
        sticky: "__sticky",
        bottom: "__stick-bottom",
    };
    const topValue = document.querySelector(".header").offsetHeight + 30;
    const parent = el.parentNode;

    const onScroll = () => {
        const parentTop = getCoords(parent).top;
        const elTop = getCoords(el).top;
        const scroll = window.pageYOffset + topValue;
        const stickToTop = scroll < parentTop;
        const sticky =
            scroll > parentTop && scroll + el.offsetHeight <= parentTop + parent.offsetHeight;
        const stickToBottom = scroll + el.offsetHeight > parentTop + parent.offsetHeight;

        if (stickToTop && !el.classList.contains(posClasses.top))
            addToClist(posClasses.top);
        if (sticky && !el.classList.contains(posClasses.sticky))
            addToClist(posClasses.sticky);
        if (stickToBottom && !el.classList.contains(posClasses.bottom))
            addToClist(posClasses.bottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    if (transitionEl) {
        if (Array.isArray(transitionEl)) transitionEl.forEach(tr => tr.addEventListener('transitionend', onScroll));
        else transitionEl.addEventListener('transitionend', onScroll);
    }
    const observer = new MutationObserver(onScroll);
    observer.observe(document, { childList: true, subtree: true });

    function addToClist(toAdd) {
        el.classList.add(toAdd);

        toAdd === posClasses.sticky ? el.style.top = `${topValue}px` : el.style.removeProperty('top');

        for (let key in posClasses)
            posClasses[key] !== toAdd
                ? el.classList.remove(posClasses[key])
                : false;
    }
}

// преобразование секунд в формат времени мм:сс
export function formatToMinutes(timestamp) {
    if(typeof timestamp === 'number') timestamp = Math.round(timestamp).toString();
    if(typeof timestamp === 'string') timestamp = Math.round(parseInt(timestamp)).toString();

    if (timestamp.length < 2) return `00:0${timestamp}`;
    else if (timestamp.length >= 2) {
        const minutes = Math.floor(timestamp / 60);
        const seconds = timestamp - (minutes * 60);

        let minutesStr = minutes.toString();
        let secondsStr = seconds.toString();
        if (minutesStr.length < 2) minutesStr = `0${minutesStr}`;
        if (secondsStr.length < 2) secondsStr = `0${secondsStr}`;

        return `${minutesStr}:${secondsStr}`;
    }
}

// сделать HTMLElement //
export function createNode(tagName, content, className = null){
    const node = document.createElement(tagName);
    if(className) node.className = className;
    typeof content === 'string' ? node.innerHTML = content : node.append(content);
    return node;
}