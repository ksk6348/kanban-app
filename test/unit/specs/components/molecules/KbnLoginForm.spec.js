import { mount } from '@vue/test-utils'
import KbnLoginForm from '@/components/molecules/KbnLoginForm.vue'
import sinon from 'sinon'

describe('KbnLoginForm', () => {
  describe('プロパティ', () => {
    describe('validation', () => {
      let loginForm
      beforeEach(done => {
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginForm.vm.$nextTick(done)
      })
      describe('email', () => {
        describe('required', () => {
          describe('何も入力されていない', () => {
            it('validation.email.requiredがinvalidであること', () => {
              loginForm.setData({ email: '' })
              expect(loginForm.vm.validation.email.required).toBe(false)
            })
          })
          describe('入力あり', () => {
            it('validation.email.requiredがvalidであること', () => {
              loginForm.setData({ email: 'foo@domain.com' })
              expect(loginForm.vm.validation.email.required).toBe(true)
            })
          })
        })
        describe('format', () => {
          describe('メールアドレス形式でないフォーマット', () => {
            it('validation.email.formatがinvalidであること', () => {
              loginForm.setData({ email: 'foobar' })
              expect(loginForm.vm.validation.email.format).toBe(false)
            })
          })
          describe('メールアドレス形式のフォーマット', () => {
            it('validation.email.formatがvalidであること', () => {
              loginForm.setData({ email: 'foo@domain.com' })
              expect(loginForm.vm.validation.email.format).toBe(true)
            })
          })
        })
      })
      describe('password', () => {
        describe('required', () => {
          describe('何も入力されていない', () => {
            it('validation.password.requiredがinvalidであること', () => {
              loginForm.setData({ password: '' })
              expect(loginForm.vm.validation.password.required).toBe(false)
            })
          })
          describe('入力あり', () => {
            it('validation.password.requiredがvalidであること', () => {
              loginForm.setData({ password: 'xxxx' })
              expect(loginForm.vm.validation.password.required).toBe(true)
            })
          })
        })
      })
    })
    describe('valid', () => {
      let loginForm
      beforeEach(done => {
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginForm.vm.$nextTick(done)
      })
      describe('バリデーション項目全てOK', () => {
        it('validになること', () => {
          loginForm.setData({
            email: 'foo@domain.com',
            password: '12345678'
          })
          expect(loginForm.vm.valid).toBe(true)
        })
      })
      describe('バリデーション項目NG', () => {
        it('invalidになること', () => {
          loginForm.setData({
            email: 'foo@domain.com',
            password: ''
          })
          expect(loginForm.vm.valid).toBe(false)
        })
      })
    })
    describe('disableLoginAction', () => {
      let loginForm
      beforeEach(done => {
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: () => {} }
        })
        loginForm.vm.$nextTick(done)
      })
      describe('バリデーションNG項目ある', () => {
        it('ログイン処理は無効', () => {
          loginForm.setData({
            email: 'foo@domain.com',
            password: ''
          })
          expect(loginForm.vm.disableLoginAction).toBe(true)
        })
      })
      describe('バリデーション項目全てOKかつログイン処理中ではない', () => {
        it('ログイン処理は有効', () => {
          loginForm.setData({
            email: 'foo@domain.com',
            password: '12345678'
          })
          expect(loginForm.vm.disableLoginAction).toBe(false)
        })
      })
      describe('バリデーション項目全てOKかつログイン処理中', () => {
        it('ログイン処理は無効', () => {
          loginForm.setData({
            email: 'foo@domain.com',
            password: '12345678',
            progress: true
          })
          expect(loginForm.vm.disableLoginAction).toBe(true)
        })
      })
    })
    describe('onlogin', () => {
      let loginForm
      let onloginStub
      beforeEach(done => {
        onloginStub = sinon.stub()
        loginForm = mount(KbnLoginForm, {
          propsData: { onlogin: onloginStub }
        })
        loginForm.setData({
          email: 'foo@example.com',
          password: '12345678'
        })
        loginForm.vm.$nextTick(done)
      })
      describe('resolve', () => {
        it('reolveされること', done => {
          onloginStub.resolves()
          loginForm.find('button').trigger('click')
          expect(onloginStub.called).toBe(false)
          expect(loginForm.vm.error).toBe('')
          expect(loginForm.vm.disableLoginAction).toBe(true)
          loginForm.vm.$nextTick(() => {
            expect(onloginStub.called).toBe(true)
            const authInfo = onloginStub.args[0][0]
            expect(authInfo.email).toBe(loginForm.vm.email)
            expect(authInfo.password).toBe(loginForm.vm.password)
            loginForm.vm.$nextTick(() => {
              expect(loginForm.vm.error).toBe('')
              expect(loginForm.vm.dispatch).toBe(false)
              done()
            })
          })
        })
      })
      describe('reject', () => {
        it('rejectされること', done => {
          onloginStub.rejects(new Error('login error!'))
          loginForm.find('button').trigger('click')
          expect(onloginStub.called).toBe(false)
          expect(loginForm.vm.error).toBe('')
          expect(loginForm.vm.disableLoginAction).toBe(true)
          loginForm.vm.$nextTick(() => {
            expect(onloginStub.called).toBe(true)
            const authInfo = onloginStub.args[0][0]
            expect(authInfo.email).toBe(loginForm.vm.email)
            expect(authInfo.password).toBe(loginForm.vm.password)
            loginForm.vm.$nextTick(() => {
              expect(loginForm.vm.error).toBe('login error!')
              expect(loginForm.vm.disableLoginAction).toBe(false)
              done()
            })
          })
        })
      })
    })
  })
})
