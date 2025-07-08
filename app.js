function completeReservation() {
  const name = document.getElementById("user-name").value;
  const birth = document.getElementById("user-birth").value;
  const phone = document.getElementById("user-phone").value;
  const facility = selectedFacility; // 이 변수는 기존 코드에 따라 선언 필요
  const room = selectedRoom;         // 마찬가지
  const time = selectedTime;         // 마찬가지
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜

  const newReservation = {
    name,
    birth,
    phone,
    facility,
    room,
    time,
    date: today
  };

  const dbRef = firebase.database().ref("reservations");
  const newKey = dbRef.push().key;

  dbRef.child(newKey).set(newReservation).then(() => {
    showScreen('success-screen'); // 예약 완료 화면으로 이동
  });
}

function searchReservations() {
  const searchName = document.getElementById("search-name").value;
  const searchBirth = document.getElementById("search-birth").value;
  const searchPhone = document.getElementById("search-phone").value;

  const dbRef = firebase.database().ref("reservations");
  dbRef.once("value").then(snapshot => {
    const results = [];
    snapshot.forEach(child => {
      const r = child.val();
      if (r.name === searchName && r.birth === searchBirth && r.phone === searchPhone) {
        results.push(r);
      }
    });

    const resultContainer = document.getElementById("reservation-list");
    resultContainer.innerHTML = results.length === 0
      ? '<div class="no-reservations">예약 내역이 없습니다.</div>'
      : results.map(r =>
          `<div class="reservation-item">
             <strong>${r.date}</strong><br>
             ${r.facility} ${r.room || ''}<br>
             ${r.time}
           </div>`).join('');
    document.getElementById("search-results").style.display = "block";
  });
}
