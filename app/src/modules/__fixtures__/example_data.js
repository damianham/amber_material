
export function dataExamples(type) {
  if (type === "Int32" || type === "Int64") {
    return ['42', '99']
  } else if (type === 'Float32' || type === 'Float64') {
    return ['42.95', '99.67']
  } else if (type === 'String') {
    return ['Widget', 'Gasket']
  } else if (type === 'Bool') {
    return ['1', '0']
  }
}

export function randomString(len) {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, len);
}

export const exampleUsers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Wayne",
    email: "theduke@example.com",
    nickname: "Big Bad John"
  },
  {
    id: 2,
    first_name: "Elvis",
    last_name: "Presley",
    email: "elvis@example.com",
    nickname: "The King of Rock and Roll"
  },
  {
    id: 3,
    first_name: "Paddington",
    last_name: "Bear",
    email: "paddington@example.com",
    nickname: "Silly old bear"
  }
];
