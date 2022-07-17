<template>
    <div
        class="select"
        :class="{ '__active': showOptions }"
        @click="toggleOptions"
        ref="select"
    >
        <div class="select__value">
            {{ selectedTitle }}
        </div>
        <div class="select__items">
            <label
                class="select__item"
                v-for="opt in options"
                :key="opt.value"
            >
                <input
                    type="radio"
                    :name="inputName"
                    :value="opt.value"
                    :data-opt-title="opt.title"
                    @change="onChange"
                    ref="selectInput"
                />
                <p>{{ opt.title }}</p>
            </label>
        </div>
    </div>
</template>

<script>
export default {
    name: "SelectBlock",
    emits: ["changeSelected"],
    props: {
        options: {
            type: Array,
            required: true,
        },
        inputName: {
            type: String,
            required: true,
        },
    },
    data() {
        return {
            showOptions: false,
            selectedTitle: "",
        };
    },
    methods: {
        onChange() {
            const checked = this.$refs.selectInput.find((inp) => inp.checked);
            const value = checked.value;
            this.selectedTitle = checked.dataset.optTitle;
            this.$emit("changeSelected", value);
            this.showOptions = false;
        },
        initSelect() {
            const changeEvent = new Event("change");
            const inp = this.$refs.selectInput[0];
            inp.checked = true;
            inp.dispatchEvent(changeEvent);
        },
        toggleOptions() {
            this.showOptions = !this.showOptions;
        },
        hideOptions(event) {
            const select = this.$refs.select;
            const isSelect = event.target === select;
            const isSelectChild = event.target.closest(".select") === select;

            if (!isSelect && !isSelectChild) this.showOptions = false;
        },
    },
    mounted() {
        this.initSelect();
        document.addEventListener("click", this.hideOptions);
    },
};
</script>