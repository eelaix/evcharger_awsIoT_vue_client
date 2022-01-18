<template>
  <div id="app3">
  <div v-if="loads==0" class="mask" @touchmove.prevent>&nbsp;</div>
  <b-container fluid="xs">
    <b-table-simple hover small caption-top responsive="xs">
      <b-thead head-variant="light">
        <b-tr>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_cretime')">{{'ucreatetime'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_lastactive')">{{'ulastactive'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_deviceos')">{{'udeviceos'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_browser')">{{'ubrowser'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_ipaddress')">{{'uipaddress'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_uflag')">{{'uflag'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_chgtimes')">{{'uchgtimes'|trans}}</b-th>
          <b-th v-b-tooltip.hover :title="$t('message.title_usr_powall')">{{'upowall'|trans}}</b-th>
        </b-tr>
      </b-thead>
      <b-tbody v-for="(item, index) in items" :key="index">
        <b-tr :class="item.utype==9?'vipuser':''">
          <b-td>{{item.regtime}}</b-td>
          <b-td>{{item.lastvisit}}</b-td>
          <b-td>{{item.uadevice}}</b-td>
          <b-td>{{item.uabrowser}}</b-td>
          <b-td>{{item.ipaddress}}</b-td>
          <b-td>{{item.uflag}}</b-td>
          <b-td>{{item.chgtimes}}</b-td>
          <b-td>{{item.powall}}</b-td>
      </b-tr>
    </b-tbody>
    </b-table-simple>
  <div v-show="items.length==0" class="pl-4 pr-4">
    <b-card header-tag="header" footer-tag="footer" style="box-shadow: 10px 10px 20px rgba(51, 51, 51, .4);">
      <template v-slot:header>
        <h4 class="mb-0"><b-icon icon="lightning"></b-icon> {{$t('message.user_empty_title')}}</h4>
      </template>
      <b-card-text>
        <p>
          <span v-html="$t('message.user_empty_context')"></span>
         </p>
      </b-card-text>
    </b-card>
  </div>
  <b-form inline class="ml-2 mb-4 mt-4">
    <b-input-group class="col-12">
        <b-button-group class="mr-auto">
          <b-button variant="outline-success" :disabled="nextPageToken==undefined">{{$t('message.btn_more')}}</b-button>
          <b-button variant="outline-success" href="/devices.html">{{$t('message.btn_device')}}</b-button>
        </b-button-group>
        <b-form-input :placeholder="$t('message.searchuhint')" class="ml-3" v-model="search"></b-form-input>
        <b-input-group-append>
        <b-button variant="outline-primary" @click="dosearch">{{$t('message.btn_search')}}</b-button>
        </b-input-group-append>
    </b-input-group>
  </b-form>
  <b-modal v-model="modalshow" no-close-on-backdrop no-close-on-esc hide-header ok-only :ok-title="$t('message.btn_ok')">{{modalmsg}}</b-modal>
  </b-container>
  </div>
</template>
<script>
export default {
  name: 'users',
  components: {
  },
  mounted() {
    this.login();
    this.fetchData();
  },
  data() {
    return {
      loads:0,
      clicked:false,
      modalshow: false,
      modalmsg:'',
      search: '',
      items: [],
      nextPageToken:undefined
    }
  },
  methods: {
    async fetchData(){
      let evuserid = localStorage.getItem('evuserid');
      let qrystr = '/listusers?tm='+new Date().getTime()+'&userid='+evuserid;
      if ( this.nextPageToken ) {
        qrystr = qrystr + '&nextToken=' + this.nextPageToken;
      }
      if ( this.search && this.search.length>0 ) {
        qrystr = qrystr + '&search=' + this.search;
      }
      let result = await this.axios.get(qrystr);
      if (result.status==200) {
        this.loads++;
        if ( result.data.nextToken ) this.nextPageToken = result.data.nextToken;
        this.items.push.apply(this.items, result.data.items);
      }
    },
    async login(){
      let evuserid = localStorage.getItem('evuserid');
      let qryparam = '/login?userid='+evuserid+'&tm='+new Date().getTime();
      let loginresult = await this.axios.get(qryparam);
      this.utype = loginresult.data.utype;
      this.uflag = loginresult.data.uflag;
      if (loginresult.data.id)
      {
        localStorage.setItem('evuserid', loginresult.data.id);
      }
    },
    dosearch() {
        this.nextPageToken = undefined;
        this.items = [];
        this.fetchData();
    },
  }
}
</script>
<style>
.vipuser {
    background-color: rgba(255,0,0,0.1);
}
.mask {
    background-color: rgba(0,0,0,0.7);
    position:fixed;
    top:0;
    left:0;
    width:100%;
    height:100%;
    z-index:10;
}
</style>
