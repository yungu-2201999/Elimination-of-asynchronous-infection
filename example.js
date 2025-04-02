function getUser() {
  return fetch('./1.json');
}

function m1() {
  const user = getUser();
  return user;
}

function m2() {
  const user = m1();
  return user;
}

function m3() {
  const user = m2()
  return user;
}

function main() {
  const user = m3();
  console.log(user);
}

run(main);

function run(fn) {
  const oldFetch = window.fetch;
  const cache = {
    status: "pendding",
    value: null
  }
  console.log("cache", cache)


  function newFetch(...args) {
    if (cache.status === "fulfilled") {
      return cache.value;
    } else if (cache.status === "rejected") {
      throw cache.value;
    }
    const p = oldFetch(...args).then(r => r.json()).then(res => {
      cache.status = "fulfilled";
      cache.value = res;
    }).catch(err => {
      cache.status = "rejected";
      cache.value = err;
    })
    throw p;
  }
  window.fetch = newFetch;
  try {
    fn();
  } catch (e) {
    if (e instanceof Promise) {
      e.finally(() => {
        window.fetch = newFetch;
        fn();
        window.fetch = oldFetch;
      });
    }
  }
  window.fetch = oldFetch;
}
