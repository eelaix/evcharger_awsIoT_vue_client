<template>
  <b-modal id="mdSelector1" size="lg" hide-header hide-footer>
    <b-card header-tag="header" style="box-shadow: 10px 10px 20px rgba(51, 210, 51, .4);" class="mb-4">
      <template v-slot:header>
        <span class="mb-0">{{$t('message.selector_mine')}}</span>
      </template>
      <b-card-text>
        <b-row class="p-4" cols="3">
        <div class="mb-3" v-for="(dat,idx) in permedcharger" :key="idx">
        <b-button variant="success" @click="removeme(dat)">{{dat}}</b-button>
        </div>
        </b-row>
        <b-input-group class="ml-auto">
            <b-button variant="outline-primary" block @click="doconfirmok" :disabled="clicked==true">{{$t('message.btn_ok')}}</b-button>
        </b-input-group>
      </b-card-text>
    </b-card>
    
    <b-card header-tag="header" footer-tag="footer" style="box-shadow: 10px 10px 20px rgba(51, 51, 51, .4);" class="mb-4">
      <template v-slot:header>
        <span class="mb-0">{{$t('message.selector_noauth')}}</span>
      </template>
      <b-card-text>
        <b-row class="p-4" cols="3">
        <div class="mb-3" v-for="(dat,idx) in dbitems" :key="idx">
        <b-button variant="info" @click="selectme(dat)">{{dat}}</b-button>
        </div>
        </b-row>
        <b-input-group class="ml-auto">
            <b-form-input :placeholder="$t('message.chargersearch')" v-model="search"></b-form-input>
            <b-input-group-append>
            <b-button variant="outline-primary" @click="dosearch" :disabled="clicked==true">{{$t('message.btn_search')}}</b-button>
            </b-input-group-append>
        </b-input-group>
      </b-card-text>
    </b-card>
    
  </b-modal>
</template>
<script>
  export default {
    name: 'Selectdevice',
    props: {
      userid:String,
      uflag:String,
      permedcharger:Array
    },
    data() {
      return {
          clicked:false,
          search:'',
          nextPageToken:undefined,
          dbitems:[]
      };
    },
    mounted() {
        this.fetchData();
    },
    beforeUpdate(){
        if (this.permedcharger.length>0) {
            this.permedcharger.forEach((id) => {
                if (this.dbitems.contains(id)) {
                    this.dbitems.removeone(id);
                }
            });
        }
    },
    methods: {
        removeme(theid){
            this.permedcharger.removeone(theid);
            if (!this.dbitems.contains(theid)) {
                this.dbitems.push(theid);
            }
        },
        selectme(theid){
            this.dbitems.removeone(theid);
            if (!this.permedcharger.contains(theid)) {
                this.permedcharger.push(theid);
            }
        },
        async fetchData(){
            let evuserid = localStorage.getItem('evuserid');
            let qrystr = '/listchargers?tm='+new Date().getTime()+'&userid='+evuserid;
            if ( this.nextPageToken ) {
                qrystr = qrystr + '&nextToken=' + this.nextPageToken;
            }
            if ( this.search && this.search.length>0 ) {
                qrystr = qrystr + '&search=' + this.search;
            }
            let haspermed = true;
            let result = await this.axios.get(qrystr);
            if (result.status==200) {
                this.clicked = false;
                if ( result.data.nextToken ) this.nextPageToken = result.data.nextToken;
                for (let i=0;i<result.data.items.length;i++) {
                    haspermed = this.permedcharger.contains(result.data.items[i].chargerid);
                    if (haspermed==false) {
                        this.dbitems.push(result.data.items[i].chargerid);
                    }
                }
            }
        },
        async dosearch(){
            this.clicked = true;
            let checkok = true;
            if (this.search.length>0) {
                if (this.search.length<4) {
                    alert('Search digits too short!');
                    checkok = false;
                } else if (this.search.length>6) {
                    alert('Search digits too long!');
                    checkok = false;
                }
            }
            if (checkok) {
                this.dbitems = [];
                this.fetchData();
            }
        },
        doconfirmok() {
            this.clicked = false;
            this.$emit('callback', {userid:this.userid,permedcharger:this.permedcharger});
            this.$bvModal.hide('mdSelector1');
        },
    }
  }
</script>