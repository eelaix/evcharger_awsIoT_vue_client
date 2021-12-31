<template>
  <b-modal id="mdSelector0" size="sm" hide-header hide-footer>
    <b-row class="p-4" cols="1">
      <div class="mb-3" v-for="(dat,idx) in datas" :key="idx">
      <b-button block :variant="index==idx?'primary':'outline-primary'" @click="selectme(idx)">{{dat}}</b-button>
      </div>
    </b-row>
  </b-modal>
</template>

<script>
  export default {
    name: 'Selector',
    props: {
      funid:Number,
      index:Number,
      datas:Array
    },
    data() {
      return {
      };
    },
    mounted() {
    },
    methods: {
      selectme(idx) {
        this.index = idx;
        this.$emit('callback', this);
        this.$bvModal.hide('mdSelector0');
      },
    }
  }
</script>
