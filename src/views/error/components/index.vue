<template>
    <div class="wscn-httpError-container">
        <div class="wscn-httpError">
            <div class="pic-Error">
                <img class="pic-Error__parent" src="@/assets/404_images/404.png" alt="Error">
            </div>
            <div class="bullshit">
                <span class="bullshit__oops">{{config[type].title}}</span>
                <div class="bullshit__headline">{{config[type].desc}}</div>
                <router-link to="/" class="bullshit__return-home">返回</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    import Config from './typeConfig'

    export default {
        name: 'PageError',
        props: ['type'],
        data() {
            return {
                config: Config
            }
        },
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import '@/styles/_setting.scss';

    .wscn-httpError-container {
        transform: translate(-50%, -50%);
        position: absolute;
        top: 40%;
        left: 50%;
    }

    .wscn-httpError {
        position: relative;
        width: 1200px;
        padding: 0 50px;
        overflow: hidden;
        .pic-Error {
            position: relative;
            width: 600px;
            margin: 0 auto;
            overflow: hidden;
            &__parent {
                width: 100%;
            }
        }
        .bullshit {
            position: relative;
            margin: 0 auto;
            text-align: center;
            width: 300px;
            padding: 0  0 30px 0;
            overflow: hidden;
            &__oops {
                font-size: 32px;
                font-weight: bold;
                line-height: 40px;
                color: $primary;
                opacity: 0;
                margin-bottom: 20px;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-fill-mode: forwards;
            }
            &__headline {
                font-size: 16px;
                line-height: 24px;
                color: #222;
                font-weight: bold;
                opacity: 0;
                margin-bottom: 10px;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-delay: 0.1s;
                animation-fill-mode: forwards;
            }
            &__info {
                font-size: 13px;
                line-height: 21px;
                color: grey;
                opacity: 0;
                margin-bottom: 30px;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-delay: 0.2s;
                animation-fill-mode: forwards;
            }
            &__return-home {
                display: block;
                margin: 20px auto;
                width: 110px;
                height: 36px;
                background: $primary;
                border-radius: 100px;
                text-align: center;
                color: #ffffff;
                opacity: 0;
                font-size: 14px;
                line-height: 36px;
                cursor: pointer;
                animation-name: slideUp;
                animation-duration: 0.5s;
                animation-delay: 0.3s;
                animation-fill-mode: forwards;
            }
            @keyframes slideUp {
                0% {
                    transform: translateY(60px);
                    opacity: 0;
                }
                100% {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
        }
    }
</style>
