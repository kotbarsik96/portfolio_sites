<template>
    <div class="filter">
        <div class="filter__title __icon-filter" ref="filterTitle">Фильтр</div>
        <div class="filter__body" ref="filterBody">
            <div
                class="filter__body-block"
                v-for="field in fields"
                :key="field.key"
                :data-filter-block-key="field.key"
                ref="filterBodyBlock"
            >
                <template
                    v-if="isSelector(field.type) && fieldOptions[field.key]"
                >
                    <h6 class="filter__list-title">{{ field.title }}</h6>
                    <ul class="filter__list">
                        <li
                            class="filter__item filter__item--checkbox"
                            v-for="(opt, optIndex) in fieldOptions[field.key]
                                .list"
                            :key="optIndex"
                        >
                            <label v-if="fieldOptions[field.key]">
                                <input
                                    :type="field.type"
                                    :name="field.key"
                                    :value="opt.value"
                                    ref="selectorInput"
                                    @change="doFilter"
                                    v-model="fieldOptions[field.key].checked"
                                />
                                <span>{{ opt.title }}</span>
                            </label>
                        </li>
                    </ul>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
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
        // пример: { title: 'По количеству страниц', key: 'isSinglePage', type: 'checkbox', boolean: { only: false, forTrue: "Одностраничный", forFalse: "Многостраничный" } },
        // где key - ключ в объектах objectToFilter. Может быть вложенным (напр.: key.subkey.subsubkey), при этом такой ключ обязательно должен быть либо строкой, либо массивом строк;
        // boolean - параметры для boolean значений. Если only == true, то для фильтра важно будет только наличие или отсутствие параметра в искомом объекте; forFalse и forTrue отображают соответствующий текст в опции для фильтра
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
    data() {
        return {
            fieldOptions: {},
        };
    },
    methods: {
        isSelector(fieldType) {
            return fieldType === "checkbox" || fieldType === "radio";
        },
        getFieldOptions() {
            for (let field of this.fields) {
                const type = field.type;
                const fieldOption = { type };

                switch (type) {
                    case "checkbox":
                    case "radio":
                        fieldOption.list = this.getSelector(field);
                        fieldOption.checked = type === "checkbox" ? [] : false;
                        if (field.boolean) {
                            fieldOption.isBooleanOnly = field.boolean.only;
                        }
                        break;
                }

                this.fieldOptions[field.key] = fieldOption;
            }
            this.$nextTick().then(() => (this.isFilterReady = true));
        },
        getSelector(field) {
            const options = [];
            const elems = Object.values(this.objectToFilter);

            for (let el of elems) {
                const value = parseKey(el, field.key);

                if (field.boolean) {
                    if (field.boolean.only) return getBoolean(value);
                }
                if (typeof value === "boolean") getBoolean(value);
                else if (typeof value === "string")
                    options.push({ title: value, value });
                else if (typeof value === "object") getFromObject(value);
            }

            return Array.from(options);

            function getBoolean(value) {
                if (field.boolean) {
                    const forTrue = field.boolean.forTrue || "Есть";
                    const forFalse = field.boolean.forFalse || "Нет";
                    const stringForValue = value ? forTrue : forFalse;

                    const option = { title: stringForValue, value };
                    if (!isOptionsIncludes(option)) options.push(option);
                } else {
                    const stringForValue = value ? "Есть" : "Нет";

                    const option = { title: stringForValue, value };
                    if (!isOptionsIncludes(option)) options.push(option);
                }
            }
            function getFromObject(value) {
                for (let elChild of Object.values(value)) {
                    const childType = typeof elChild;
                    if (childType === "string" || childType === "number") {
                        const option = { title: elChild, value: elChild };
                        if (!isOptionsIncludes(option)) options.push(option);
                    }
                }
            }
            function isOptionsIncludes(option) {
                const strOptions = JSON.stringify(options);
                const strOption = JSON.stringify(option);

                if (strOptions.includes(strOption)) return true;
                return false;
            }
        },
        doFilter() {
            const filterBlocks = this.$refs.filterBodyBlock;
            if (!filterBlocks) return;

            const isArray = Array.isArray(this.objectToFilter);
            const srcObject = isArray
                ? [...this.objectToFilter]
                : { ...this.objectToFilter };
            for (let fb of filterBlocks) {
                const fieldKey = fb.dataset.filterBlockKey;
                const fieldType = this.fieldOptions[fieldKey].type;
                if (this.isSelector(fieldType))
                    filterBySelectors.call(this, fieldKey);
            }
            // так как фильтр может работать и с массивами, и с объектами, он фильтрует их через delete; поэтому в случае с массивом его нужно привести в соответствующий вид, а в случае с объектом все манипуляции уже выполнены
            const filteredObj = isArray
                ? Array.from(srcObject).filter((el) => el)
                : srcObject;

            this.$emit("update:modelValue", filteredObj);

            // функции для фильтра (вызывать через .call(this))
            function filterBySelectors(fieldKey) {
                const options = this.fieldOptions[fieldKey];
                const checkedValues = options.checked;
                const isCheckbox =
                    options.type === "checkbox" && checkedValues.length > 0;
                const isRadio = options.type === "radio";
                const isBooleanOnly = options.boolean && options.boolean.only;

                for (let key in srcObject) {
                    const el = srcObject[key];

                    if (isBooleanOnly) {
                        const value = Boolean(parseKey(el, fieldKey));

                        if (isCheckbox) {
                            const checkedBooleans = checkedValues.map((el) =>
                                Boolean(el)
                            );
                            if (checkedBooleans.includes(value))
                                delete srcObject[key];
                        }
                        if (isRadio) {
                            const checkedBoolean = Boolean(checkedValues);
                            if (value !== checkedBoolean) delete srcObject[key];
                        }
                    } else {
                        const value = parseKey(el, fieldKey);

                        if (isCheckbox) {
                            if (typeof value === "object") {
                                for (let val of checkedValues) {
                                    if (!Object.values(value).includes(val)) {
                                        delete srcObject[key];
                                        break;
                                    }
                                }
                            } else {
                                if (!checkedValues.includes(value))
                                    delete srcObject[key];
                            }
                        }
                        if (isRadio) {
                            if (typeof value === "object") {
                                const values = Object.values(value);
                                if (!values.includes(checkedValues))
                                    delete srcObject[key];
                            } else {
                                if (value !== checkedValues)
                                    delete srcObject[key];
                            }
                        }
                    }
                }
            }
        },
    },
    computed: {
        ...mapGetters(["works"]),
    },
    created() {
        this.getFieldOptions();
    },
    mounted() {
        const fetchWatcher = this.$watch(
            () => this.works,
            () => {
                // инициализация SpoilerElem только после наполнения фильтр-блока
                this.$nextTick().then(() => {
                    initSpoilerElem(
                        this.$refs.filterTitle,
                        this.$refs.filterBody,
                        1249
                    );
                    fetchWatcher();
                });
            }
        );
        this.doFilter();
    },
    watch: {
        objectToFilter() {
            this.getFieldOptions();
        },
        fieldOptions: {
            handler() {
                this.$nextTick().then(this.doFilter);
            },
            deep: true,
        },
    },
};
</script>