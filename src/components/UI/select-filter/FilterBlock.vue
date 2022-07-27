<template>
    <div class="filter">
        <div
            class="filter__title __icon-filter"
            ref="filterTitle"
        >Фильтр</div>
        <div
            class="filter__body"
            ref="filterBody"
        >
            <div
                class="filter__body-block"
                v-for="fd in fields"
                :key="fd.key"
            >
                <h6 class="filter__list-title">{{ fd.title }}</h6>
                <ul class="filter__list">
                    <li
                        class="filter__item filter__item--checkbox"
                        v-for="(opt, optIndex) in getOptions(fd.key)"
                        :key="optIndex"
                    >
                        <label>
                            <input
                                :type="fd.type"
                                :name="fd.key"
                                :value="opt"
                                ref="optInput"
                                @change="doFilter"
                            />
                            <span>{{ opt }}</span>
                        </label>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import { initSpoilerElem, parseKey } from "@/assets/js/scripts.js";

export default {
    name: "FilterBlock",
    props: {
        // объект/массив объектов, в ключах которых будет произведен фильтр
        objectToFilter: {
            type: [Object, Array],
            required: true,
        },
        // параметры фильтра объекта
        // пример: { title: 'По содержимому', key: 'features', type: 'checkbox' },
        // где key - ключ в объектах objectToFilter. Может быть вложенным (напр.: key.subkey.subsubkey), при этом такой ключ обязательно должен быть либо строкой, либо массивом строк; mode - режим проверки на совпадение: 'lazy' (по умолчанию) - хотя бы одно совпадение, 'greedy' - должны быть все совпадения
        fields: {
            type: Array,
            required: true,
        },
        // отфильтрованный объект/массив
        modelValue: {
            type: [Object, Array],
        },
    },
    emits: ["update:modelValue"],
    methods: {
        getOptions(fdKey) {
            const options = [];

            for (let k in this.objectToFilter) {
                const item = this.objectToFilter[k];
                const value = item[fdKey];

                if (typeof value === "object") {
                    for (let i in value) {
                        getOpt(value[i]);
                    }
                } else getOpt(value);
            }

            return options;

            function getOpt(value) {
                if (value && typeof value !== "object") {
                    const opt = value;
                    if (!options.find((o) => o === opt)) options.push(opt);
                }
            }
        },
        doFilter() {
            const inputs = this.$refs.optInput;
            const checked = inputs.filter((inp) => inp.checked);
            let fieldKeys = checked
                .map((inp) => inp.name)
                .filter((item, index, array) => {
                    if (array.lastIndexOf(item) !== index) return false;
                    return true;
                });
            let filtered = this.objectToFilter; // изменяется в filterArr() || filterObj()

            if (checked.length <= 0)
                return this.$emit("update:modelValue", this.objectToFilter);
            if (Array.isArray(this.objectToFilter)) filterArr.call(this);
            else filterObj.call(this);

            this.$emit("update:modelValue", filtered);

            function filterObj() {}
            function filterArr() {
                for (let fieldKey of fieldKeys) {
                    filtered = filtered.filter((item) => {
                        return filterFunc(item, fieldKey);
                    });
                }
            }
            function filterFunc(item, fieldKey) {
                for (let inp of checked) {
                    const inputKey = inp.name;
                    const inputValue = inp.value;

                    if (inputKey === fieldKey) {
                        const itemValue = parseKey(item, inputKey);
                        const isObj = typeof itemValue === "object";

                        if (!isObj && itemValue === inputValue) return true;
                        if (
                            isObj &&
                            Object.values(itemValue).includes(inputValue)
                        )
                            return true;
                        continue;
                    }
                }
            }
        },
    },
    mounted() {
        const optInputs = this.$refs.optInput;
        if (optInputs && optInputs.length > 0) {
            optInputs[0].dispatchEvent(new Event("change"));
            this.doFilter();
        }
        initSpoilerElem(this.$refs.filterTitle, this.$refs.filterBody, 1249);
    },
    watch: {
        objectToFilter(newVal) {
            this.$nextTick().then(() => {
                setTimeout(() => {
                    if (newVal.length > 0) this.doFilter();
                }, 100);
            });
        },
    },
};
</script>