<script>
    import Footer from './Footer.svelte';
    import Header from './Header.svelte';
    import './style.css';
</script>

<main>
    <Header></Header>
        <slot></slot>
    <Footer></Footer>
</main>


