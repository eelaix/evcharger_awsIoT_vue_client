<template>
  <b-modal id="mdSelector1" size="lg" hide-header hide-footer>
    <b-card header-tag="header" style="box-shadow: 10px 10px 20px rgba(51, 210, 51, .4);" class="mb-4">
      <template v-slot:header>
        <span class="mb-0">{{$t('message.selector_mine')}}({{uflag}})</span>
      </template>
      <b-card-text>
        <b-row class="p-4" cols="3">
        <div class="mb-3" v-for="(dat,idx) in permedcharger" :key="idx">
        <b-button variant="success" @click="removeme(dat)">{{dat}}</b-button>
        </div>
        </b-row>
        <b-input-group class="ml-auto">
            <b-button variant="outline-primary" block @click="doconfirmok">{{$t('message.btn_ok')}}</b-button>
        </b-input-group>
      </b-card-text>
    </b-card>
    
    <b-card header-tag="header" footer-tag="footer" style="box-shadow: 10px 10px 20px rgba(51, 51, 51, .4);" class="mb-4">
      <template v-slot:header>
        <span class="mb-0">{{$t('message.selector_noauth')}}</span>
      </template>
      <b-card-text>
        <b-row class="p-4" cols="1" v-if="clicked">
        <b-icon icon="arrow-clockwise" animation="spin" font-scale="8" variant="danger"></b-icon>
        </b-row>
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
      callid:Number,
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
    beforeUpdate(){
        if (this.callid==0) {
            this.callid = 1;
            this.clicked = true;
            this.nextPageToken = undefined;
            this.search = '';
            this.dbitems = [];
            this.fetchData();
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
            let qrystr = '/listchargerids?tm='+new Date().getTime()+'&userid='+evuserid+'&callid='+this.callid;
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
                    haspermed = this.permedcharger.contains(result.data.items[i]);
                    if (haspermed==false) {
                        this.dbitems.push(result.data.items[i]);
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
                this.callid++;
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