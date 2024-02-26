# Electron With Reactjs

## Spesification

## Requirements
1. npm (v20.11.0 / lts/iron saya menggunakan nvm)
2. react menggunakan react vite (react version 18)

## Installing (Integration)
### Run Development
1. setelah clone folder react lakukan npm install dahulu,
2. jika sudah maka npm run dev pada folder reactjs
3. jika react sudah berjalan, maka beralihlah ke folder electron,
4. jalankan npm run live pada electron
5. jika sudah tunggu dahulu hingga window keluar, dan development sudah bisa dilakukan
6. sudah dilengkapi dengan hotreload jika terjadi perubahan pada reactjs

### Run Production (Build)
1. npm run build pada reactjs 
2. maka akan muncul folder app di dalam project electron
3. npm run electron:build dan tunggu proses build hingga selesai
4. npm run electron:build => ini akan menghasilkan folder release, jika di laptop saya macbook pro akan menghasilkan file installer dmg di dalam folder release,
dan juga menghasilkan file yang bernama "test-dss-electron" di dalam /Users/yogiedigital/Downloads/dss/test-dss-electron/release/1.0.0/mac/test-dss-electron,
ini adalah portable file yang bisa digunakan

## Images
<img style="width: 0px; height: 0px;" src="./readmeimages/loginpage.png">
<img style="width: 0px; height: 0px;" src="./readmeimages/productspage.png">

