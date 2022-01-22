<template>
  <div id="app1">
  <div v-if="loads==0" class="mask" @touchmove.prevent>&nbsp;</div>
  <b-container fluid="xs">
    <b-form inline>
      <b-navbar-nav class="mr-2 ml-auto">
        <b-nav-item @click="setLocale">{{'Change Language To: '|trans}}
        <b-avatar class="btn ml-2" v-t.text="'message.languageto'" @click="setLocale"></b-avatar>
        </b-nav-item>
      </b-navbar-nav>
    </b-form>
    <div class="boxw devbox1">
        <div class="boxw devbox2" :class="chargerstaclass[charge.stateid]">
          <div class="boxhead mt-4 mb-4">
          <div class="pt-3" :class="requestclass">{{'chargerid'|trans}}: {{chargerid}}</div>
          </div>
          <b-row cols="2">
            <b-col class="rowpad1">
    <div>{{'state_dev'|trans}}: <br/><span class="text-info">{{CHARGERSTATS[charge.stateid]|trans}}</span></div>
    <div>{{'state_stop'|trans}}: <br/><span class="text-info">{{charge.stp==1?$t('message.stopdn'):$t('message.normal')}}</span></div>
    <div>{{'state_l_gnd'|trans}}: <br/><span class="text-info">{{charge.lgd==1?$t('message.normal'):$t('message.abnormal')}}</span><span class="text-danger" v-if="charge.dor==0">*</span></div>
    <div>{{'charge_pnp'|trans}}: <br/><span class="text-info">{{(charge.swk&4==0)?$t('message.forbid'):$t('message.allowed')}}</span></div>
    <div>{{'charge_guestok'|trans}}: <br/><span class="text-info">{{charge.guestok==1?$t('message.allowed'):$t('message.forbid')}}</span></div>
            </b-col>
            <b-col class="rowpad2">
    <div>{{'charge_volmain'|trans}}: <br/><span class="text-primary">{{charge.pva[gunid]}}V</span></div>
    <div>{{'charge_current'|trans}}: <br/><span class="text-primary">{{charge.ixa[gunid]}}A</span></div>
    <div>{{'charge_power'|trans}}: <br/><span class="text-primary">{{charge.pwa[gunid]}}KWh</span></div>
    <div>{{'charge_tempure'|trans}}: <br/><span class="text-primary">{{charge.tpa[0]}}/{{charge.tpa[1]}}°C</span></div>
    <div>{{'charge_volplus'|trans}}: <br/><span class="text-primary">{{charge.cpa[gunid]}}/{{charge.cza[gunid]}}</span></div>
            </b-col>
          </b-row>
          <b-row cols="12" class="ml-5 mr-5 mb-4 mt-4">
            <b-col>
              <b-button @click="setgun(0)" size="lg" block :disabled="charge.imax[0]==0" :variant="gunid==0?'primary':'outline-primary'">
              {{'gunleft'|trans}}
              </b-button>
            </b-col>
            <b-col>
              <b-button @click="setgun(1)" size="lg" block :disabled="charge.imax[1]==0" :variant="gunid==1?'primary':'outline-primary'">
              {{'gunright'|trans}}
              </b-button>
            </b-col>
          </b-row>
          <b-button @click="docharge()" block size="lg" :variant="charge.stateid<2?'success':'secondary'" class="pt-4 pb-4" style="font-size:2.5em;">
            {{'startcharge'|trans}}
          </b-button>
        </div>
      </div>
      <b-input-group class="ml-auto mt-4 col-10 col-md-6 col-lg-3 col-xl-3">
          <b-form-input :placeholder="$t('message.myuflaghint')" v-model="uflag"></b-form-input>
          <b-input-group-append>
            <b-button variant="info" @click="setuflag" :disabled="clicked">{{$t('message.btn_save')}}</b-button>
          </b-input-group-append>
      </b-input-group>
  </b-container>
  </div>
</template>
<script>
const getQueryString = function ( name ) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)")
  let r = window.location.search.substr(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}
import { ChargerSTATS } from '@/config'
export default {
  name: 'charger',
  components: {
  },
  mounted() {
    this.login();
    this.fetchData();
  },
  data() {
    return {
      loads:0,
      mac: undefined,
      chargerid:getQueryString('id'),
      utype:0,
      uflag:'',
      clicked:false,
      requestclass:'text-danger',
      gunid:-1,
      chargerstaclass:['st_readyfree','st_readygunin','st_readywaiting','st_readycharging','st_readybadgnd','st_stopdown','st_offline'],
      charge:{mac:'',guestok:1,gunstyle:1,gunstandard:0,connected:0,ver:'0.0.0',swk:0,stp:0,dor:0,lgd:0,sta:[0,0],pwa:[0,0],ixa:[0,0],tpa:[0,0],cpa:[0,0],cza:[0,0],pva:[0,0],stateid:0,imax:[32,0]},
      CHARGERSTATS:ChargerSTATS
    }
  },
  methods: {
    async fetchData(){
      this.requestclass = 'text-danger';
      let evuserid = localStorage.getItem('evuserid');
      let qrystr = '/getcharger?tm='+new Date().getTime()+'&userid='+evuserid+'&gunid='+this.gunid+'&loads='+this.loads;
      if ( this.mac ) {
        qrystr = qrystr + '&mac=' + this.mac;
      } else {
        qrystr = qrystr + '&chargerid=' + this.chargerid;
      }
      let result = undefined;
      try{
        result = await this.axios.get(qrystr);
      }catch(e){
        console.error(e);
      }
      if (result && result.status==200) {
        this.loads++;
        this.charge = result.data;
        this.mac = this.charge.mac;
        if (this.gunid==-1) {
            if (this.charge.gunstyle==3) {
                let cp0 = Number(this.charge.cpa[0]);
                if (cp0>8 && cp0<11) {
                    this.gunid = 0;
                } else {
                    this.gunid = 1;
                }
            } else if (this.charge.gunstyle==1) {
                this.gunid = 1;
            } else {
                this.gunid = 0;
            }
        }
        this.requestclass = 'text-muted';
        if ( this.loads < 1000 ) {
            setTimeout(this.fetchData, 1000);
        }
      }
    },
    async login(){
      let evuserid = localStorage.getItem('evuserid');
      let loginparam = '/login?userid='+evuserid+'&tm='+new Date().getTime();
      let loginresult = undefined;
      try{
        loginresult = await this.axios.get(loginparam);
      }catch(e){
        console.error(e);
      }
      if (loginresult.data.utype==-1) {
          alert('请点击“在浏览器中打开”并添加书签，不要直接用微信操作');
      } else {
        this.utype = loginresult.data.utype;
        this.uflag = loginresult.data.uflag;
        if (evuserid==undefined || evuserid.length!=21)
        {
            localStorage.setItem('evuserid', loginresult.data.id);
        }
      }
    },
    async setmyuserid(){
      let loginparam = '/setmyuserid?tm='+new Date().getTime();
      let loginresult = await this.axios.get(loginparam);
      if (loginresult==undefined && loginresult.data && loginresult.data.userid && loginresult.data.userid.length==21)
      {
        localStorage.setItem('evuserid', loginresult.data.userid);
      }
    },
    async setgun(id){
      this.gunid = id;
      this.fetchData();
    },
    async docharge(){
      if (this.charge.stateid<2) {
        this.charge.stateid = 2;
        let evuserid = localStorage.getItem('evuserid');
        let doparam = '/docharge?tm='+new Date().getTime()+'&userid='+evuserid+'&mac='+this.charge.mac+'&gunid='+this.gunid;
        await this.axios.get(doparam);
        this.fetchData();
      }
    },
    async setuflag() {
      if ( this.uflag.length>0 ) {
        this.clicked = true;
        let evuserid = localStorage.getItem('evuserid');
        let qryparam = '/setuserflag?userid='+evuserid+'&tm='+new Date().getTime()+'&uflag='+this.uflag;
        await this.axios.get(qryparam);
      }
    },
    setLocale() {
      console.log(this.$i18n.locale);
      if (this.$i18n.locale=='EN') {
        localStorage.setItem('locale', 'CN');
        this.$i18n.locale='CN';
      } else {
        localStorage.setItem('locale', 'EN');
        this.$i18n.locale='EN';
      }
    },
  }
}
</script>
<style>
@media only screen and (orientation: portrait) {
  #app1 {
    line-height:1.5em;
    font-size:1.2em;
  }
  .boxw {
    border-radius:100%;
  }
  .devbox2 {
    border: 1px dotted rgba(0,0,0,0.1);
  }
  .rowpad1 div {
    margin-left:50px;
    padding-left:30px;
    margin-bottom:10px;
    border-radius:50%;
    width:80%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
  .rowpad2 div {
    padding-left:30px;
    margin-bottom:10px;
    border-radius:50%;
    width:76%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
}
@media only screen and (orientation: landscape) {
  #app1 {
    line-height:1.4em;
    font-size:1.2em;
  }
  .boxw {
    width:600px;
    border-radius:100%;
  }
  .devbox2 {
    border: 1px dotted rgba(0,0,0,0.1);
  }
  .rowpad1 div {
    margin-left:100px;
    padding-left:40px;
    margin-bottom: 10px;
    border-radius:50%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
  .rowpad2 div {
    padding-left:50px;
    width:70%;
    margin-bottom: 10px;
    border-radius:50%;
    border-left:1px dotted rgba(0,0,0,0.2);
    border-bottom:1px dotted rgba(0,0,0,0.2);
    border-right:1px dotted rgba(0,0,0,0.2);
  }
}
.boxhead{
  margin:0 auto;
  width:50%;
  text-align: center;
  border-radius:50%;
  border-left:1px dotted rgba(255,0,0,0.2);
  border-bottom:1px dotted rgba(255,0,0,0.2);
  border-right:1px dotted rgba(255,0,0,0.2);
}
.devbox1 {
  margin:0 auto;
  margin-top:-40px;
}
.st_readyfree {
  background-color:rgba(0,255,0,0.2);
}
.st_readygunin {
  background-color:rgba(0,255,128,0.1);
}
.st_readywaiting {
  background-color:rgba(255,255,0,0.2);
}
.st_readycharging {
  background-color:rgba(0,0,255,0.2);
}
.st_readybadgnd {
  background-color:rgba(255,128,255,0.2);
}
.st_stopdown {
  background-color:rgba(255,128,0,0.1);
}
.st_offline {
  background-color:rgba(255,0,0,0.2);
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