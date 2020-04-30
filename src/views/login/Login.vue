<template>
  <div class="ion-page">
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
      <ion-content  fullscreen>
        <form ref="form" @submit.prevent="login">
          <ion-list lines="full" class="ion-no-margin ion-no-padding">
            <ion-item>
              <ion-label position="floating">Email</ion-label>
              <ion-input
                data-vv-as="email"
                @input="email = $event.target.value"
                :value="email"
                type="text"  
                spellcheck="false"
                autocapitalize="off"             
              ></ion-input>
            </ion-item>
            <ion-item>
              <ion-label position="floating">Password</ion-label>
              <ion-input
                data-vv-as="field"
                @input="password = $event.target.value"
                :value="password"
                name="password"
                type="password"
              ></ion-input>
            </ion-item>
          </ion-list>
          <ion-row class="ion-padding">
            <ion-col>
              <ion-button expand="block" class="ion-no-margin">Reset Password</ion-button>
            </ion-col>
            <ion-col>
              <ion-button expand="block" type="submit" class="ion-no-margin">Login</ion-button>
            </ion-col>
          </ion-row>
        </form></ion-content
      >
    </ion-header>
  </div>
</template>
<script>
export default {
  	data() {
      return {
        loading:false,
        email: '',
        password:'',
        admin: false
        }
    },
    computed: {
      emailValid() {
        let foo = this.rules.email(this.email)
        if (foo === true) return true
        else return false
      },
      appVersion() {
        return process.env.VUE_APP_BUILDVERSION + '.' + process.env.VUE_APP_BUILDNUMBER
      },
      appRevision() {
        return process.env.VUE_APP_BUILDREVISIONSHORT
      },
      appEnv() {
        return process.env.NODE_ENV
      }
    },
  	methods: {
		async login() { 
		 
				this.loading = true
				await this.$store.dispatch('login', {
					email: this.email.toLowerCase(),
					password: this.password,
					admin: this.admin
				})
				this.loading = false
	 
    }
  }
}
</script>